import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface ProjectTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ProjectTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  title, 
  actionLabel, 
  onAction 
}: ProjectTableProps<T>) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {(title || actionLabel) && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
}
