export default function ReceiptPreview({
  showPreview, setShowPreview, currentDate, categories, selectedCategory, setSelectedCategory,
  sessions, filteredProducts, filteredTotal
}) {
  if (!showPreview) return null;
  return (
    <div className="mt-6 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white max-w-lg mx-auto shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">Cyber Café</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{currentDate}</p>
        </div>
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
      </div>
      <hr className="mb-3 border-gray-300 dark:border-gray-600" />
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm mb-1">Filter by Category</label>
        <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input w-full">
          {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
        </select>
      </div>
      <table className="w-full text-sm">
        <thead className="border-b border-gray-300 dark:border-gray-600 text-left">
          <tr><th className="py-1">Item</th><th className="py-1 text-right">Price</th></tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={i} className="border-b border-gray-200 dark:border-gray-600">
              <td className="py-1">Session: {s.computer} - {s.duration} min</td>
              <td className="py-1 text-right">KES {s.charge}</td>
            </tr>
          ))}
          {filteredProducts.map((p, i) => (
            <tr key={i} className="border-b border-gray-200 dark:border-gray-600">
              <td className="py-1">Product: {p.name} <span className="text-xs text-gray-500 dark:text-gray-400">({p.category})</span></td>
              <td className="py-1 text-right">KES {p.price}</td>
            </tr>
          ))}
          <tr className="font-bold text-base">
            <td className="py-2">Filtered Total</td>
            <td className="py-2 text-right">KES {filteredTotal}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">Thank you for choosing our cyber café!</p>
      <button onClick={() => setShowPreview(false)} className="mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded">Close</button>
    </div>
  );
}