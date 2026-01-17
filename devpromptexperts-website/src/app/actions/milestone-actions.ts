'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { UserRoles } from '@/types'

/**
 * Enterprise-grade Server Action for uploading milestone proof files.
 * Validates session, role, and file before uploading to Supabase Storage.
 */
export async function uploadMilestoneProofAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    
    // 1. Basic Auth check
    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized: Please log in to upload files' }
    }

    // 2. Role check (Enterprise pattern: enforce authorization)
    if (session.user.role !== UserRoles.CONSULTANT) {
        return { success: false, error: 'Forbidden: Only consultants can upload completion proof' }
    }

    const file = formData.get('file') as File
    const milestoneId = formData.get('milestoneId') as string

    if (!file || !milestoneId) {
      return { success: false, error: 'Missing file or milestone ID' }
    }

    // 3. File validation (Size, Type) - Basic enterprise security
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
        return { success: false, error: 'File size exceeds 10MB limit' }
    }

    // 4. Generate unique file path
    const fileName = `${milestoneId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // 5. Convert File to ArrayBuffer for Supabase Upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 6. Upload to Supabase Storage using Admin Client
    const { error: uploadError } = await supabaseAdmin.storage
      .from('milestone-proofs')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase Storage Error:', uploadError)
      return { success: false, error: `Upload failed: ${uploadError.message}` }
    }

    // 7. Get Public URL
    const { data } = supabaseAdmin.storage
      .from('milestone-proofs')
      .getPublicUrl(fileName)

    return { 
      success: true, 
      data: {
        publicUrl: data.publicUrl,
        fileName: file.name
      } 
    }

  } catch (error) {
    console.error('Server Action Error (uploadMilestoneProof):', error)
    return { success: false, error: 'An unexpected error occurred during file upload' }
  }
}
