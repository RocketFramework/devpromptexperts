// components/dashboard/DueInvoices.tsx
interface Invoice {
  id: string;
  invoice_number: string;
  project_name: string;
  amount: number;
  due_date: string;
  status: "draft" | "sent" | "paid" | "overdue";
  project_value: number;
  commission_rate: number;
  period?: string;
}

interface DueInvoicesProps {
  invoices: Invoice[];
}

export default function DueInvoices({ invoices = [] }: DueInvoicesProps) {
  type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

  const getStatusBadge = (status: InvoiceStatus) => {
    const styles: Record<InvoiceStatus, string> = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
    };

    const labels: Record<InvoiceStatus, string> = {
      draft: "Draft",
      sent: "Due",
      paid: "Paid",
      overdue: "Overdue",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  const handlePayInvoice = (invoiceId: string) => {
    // Handle payment logic
    console.log("Paying invoice:", invoiceId);
  };

  // Filter only unpaid invoices
  const unpaidInvoices = invoices.filter(invoice => invoice.status !== 'paid');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Due Invoices</h3>
          <p className="text-gray-600 mt-1">
            Pay your platform commission invoices
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {unpaidInvoices.length} pending
        </span>
      </div>

      {unpaidInvoices.length > 0 ? (
        <div className="space-y-4">
          {unpaidInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                      INV
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {invoice.project_name || `${invoice.period} Commission`}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Invoice #{invoice.invoice_number}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {getDaysUntilDue(invoice.due_date)}
                        </span>
                        {getStatusBadge(invoice.status)}
                      </div>
                    </div>
                  </div>

                  {/* Invoice Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Project Value</p>
                      <p className="font-semibold text-gray-900">
                        ${invoice.project_value.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Commission Rate</p>
                      <p className="font-semibold text-gray-900">
                        {invoice.commission_rate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Amount Due</p>
                      <p className="text-lg font-bold text-red-600">
                        ${invoice.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {invoice.status !== "paid" && (
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handlePayInvoice(invoice.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Pay Now
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      View Invoice
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            All caught up!
          </h4>
          <p className="text-gray-500">
            You don&#39;t have any due invoices at the moment.
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Payment Instructions:</strong> Pay your commission invoices
          before the due date to avoid service interruptions. You can pay via
          bank transfer, credit card, or other supported methods.
        </p>
      </div>
    </div>
  );
}