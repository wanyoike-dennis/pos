export default function SalesSummary({ categoryTotals }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6 max-w-lg mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sales Summary by Category</h3>
      <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-100">
        {Object.entries(categoryTotals).map(([cat, amount]) => (
          <li key={cat} className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-1">
            <span>{cat}</span>
            <span>KES {amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}