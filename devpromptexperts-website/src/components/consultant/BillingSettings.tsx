// components/settings/BillingSettings.tsx
'use client';

import { useState } from 'react';

interface Invoice {
  id: string;
  invoice_number: string;
  period: string;
  gross_earnings: number;
  platform_commission: number;
  net_earnings: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  paid_date?: string;
}

export default function BillingSettings() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { 
      id: '1',
      invoice_number: 'INV-2024-001', 
      period: 'January 2024', 
      gross_earnings: 45000, 
      platform_commission: 9000,
      net_earnings: 36000, 
      status: 'paid',
      due_date: '2024-02-05',
      paid_date: '2024-02-01',
    },
    { 
      id: '2',
      invoice_number: 'INV-2024-002', 
      period: 'February 2024', 
      gross_earnings: 52000, 
      platform_commission: 10400,
      net_earnings: 41600, 
      status: 'sent',
      due_date: '2024-03-05',
    },
  ]);

  const handlePayInvoice = async (invoiceId: string) => {
    // Mark invoice as paid
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: 'paid', paid_date: new Date().toISOString().split('T')[0] }
        : inv
    ));
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      // Generate and download invoice PDF
      console.log('Downloading invoice:', invoice.invoice_number);
    }
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };

    const labels = {
      draft: 'Draft',
      sent: 'Payment Due',
      paid: 'Paid',
      overdue: 'Overdue'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Earnings & Invoices</h2>
      
      <div className="space-y-8">
        {/* Commission Model Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💰 Manual Payment Process</h3>
          <div className="space-y-2 text-blue-800 text-sm">
            <p><strong>1. You Invoice Clients:</strong> Send invoices to your clients directly</p>
            <p><strong>2. We Invoice You:</strong> We send you commission invoices (20% of project value)</p>
            <p><strong>3. You Pay Manually:</strong> Pay our invoices before the due date</p>
            <p><strong>4. No Automatic Charges:</strong> You control when and how to pay</p>
            <p><strong>Due Date:</strong> Invoices are due on the 5th of each month</p>
          </div>
        </div>

        {/* Current Invoices */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Invoices</h3>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.period} Commission</p>
                    <p className="text-sm text-gray-600">
                      Invoice #{invoice.invoice_number} • Due {new Date(invoice.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(invoice.status)}
                    <p className="text-2xl font-bold text-gray-900 mt-1">${invoice.platform_commission.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Gross Earnings</p>
                    <p className="font-semibold text-gray-900">${invoice.gross_earnings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Commission Rate</p>
                    <p className="font-semibold text-gray-900">20%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Your Net Earnings</p>
                    <p className="font-semibold text-green-600">${invoice.net_earnings.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    {invoice.status === 'paid' && invoice.paid_date ? (
                      <p className="text-sm text-green-600">
                        Paid on {new Date(invoice.paid_date).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-sm text-yellow-600">
                        Due in {Math.ceil((new Date(invoice.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Download
                    </button>
                    {invoice.status !== 'paid' && (
                      <button
                        onClick={() => handlePayInvoice(invoice.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.platform_commission, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Paid</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  ${invoices.filter(i => i.status === 'sent').reduce((sum, inv) => sum + inv.platform_commission, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Pending Payment</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  ${invoices.reduce((sum, inv) => sum + inv.net_earnings, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Your Total Earnings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}