import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Find payments due in 3 days
    const { data: upcomingPayments, error: upcomingError } = await supabaseClient
      .rpc('get_upcoming_payments', { days_ahead: 3 })

    if (upcomingError) throw upcomingError

    // Send notifications for each upcoming payment
    for (const payment of upcomingPayments || []) {
      // Check if notification already sent today
      const { data: existingNotification } = await supabaseClient
        .from('notifications')
        .select('id')
        .eq('user_id', payment.client_id)
        .eq('type', 'payment')
        .eq('metadata->>payment_id', payment.id)
        .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1)

      if (!existingNotification || existingNotification.length === 0) {
        await supabaseClient.from('notifications').insert({
          user_id: payment.client_id,
          type: 'payment',
          title: 'Payment Reminder',
          message: `Payment of $${payment.amount} is due in 3 days`,
          link: `/payments/${payment.id}`,
          metadata: {
            payment_id: payment.id,
            due_date: payment.due_date,
            amount: payment.amount,
          },
          is_read: false,
          created_at: new Date().toISOString(),
        })
      }
    }

    // Find overdue payments (more than 7 days)
    const { data: overduePayments, error: overdueError } = await supabaseClient
      .rpc('get_overdue_payments', { days_overdue: 7 })

    if (overdueError) throw overdueError

    // Send notifications for each overdue payment
    for (const payment of overduePayments || []) {
      // Check if notification already sent today
      const { data: existingNotification } = await supabaseClient
        .from('notifications')
        .select('id')
        .eq('user_id', payment.client_id)
        .eq('type', 'payment')
        .eq('metadata->>payment_id', payment.id)
        .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1)

      if (!existingNotification || existingNotification.length === 0) {
        await supabaseClient.from('notifications').insert({
          user_id: payment.client_id,
          type: 'payment',
          title: 'Payment Overdue!',
          message: `Payment of $${payment.amount} is ${payment.days_overdue} days overdue`,
          link: `/payments/${payment.id}`,
          metadata: {
            payment_id: payment.id,
            due_date: payment.due_date,
            amount: payment.amount,
            days_overdue: payment.days_overdue,
          },
          is_read: false,
          created_at: new Date().toISOString(),
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        upcoming_notifications: upcomingPayments?.length || 0,
        overdue_notifications: overduePayments?.length || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})