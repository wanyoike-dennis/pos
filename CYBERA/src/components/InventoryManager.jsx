import { PackagePlus } from 'lucide-react';

export default function InventoryManager({
  invName, setInvName, invPrice, setInvPrice, invQty, setInvQty, invCategory, setInvCategory,
  addInventory, inventory, categories
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6 max-w-3xl mx-auto">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <PackagePlus size={20} /> Inventory Management
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 dark:placeholder-gray-300 text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
          value={invName}
          onChange={e => setInvName(e.target.value)}
          placeholder="Product Name"
        />
        <input
          className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 dark:placeholder-gray-300 text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
          value={invPrice}
          onChange={e => setInvPrice(e.target.value)}
          type="number"
          placeholder="Price"
        />
        <input
          className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 dark:placeholder-gray-300 text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
          value={invQty}
          onChange={e => setInvQty(e.target.value)}
          type="number"
          placeholder="Quantity"
        />
        <select
          className="input w-full bg-white dark:bg-gray-900 text-black dark:text-white"
          value={invCategory}
          onChange={e => setInvCategory(e.target.value)}
        >
          {categories.slice(1).map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
        </select>
        <button onClick={addInventory} className="btn-blue flex items-center gap-2"><PackagePlus size={18} /> Add/Update</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Price</th>
              <th className="py-2 px-2">Qty</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-1 px-2">{item.name}</td>
                <td className="py-1 px-2">{item.category}</td>
                <td className="py-1 px-2">KES {item.price}</td>
                <td className="py-1 px-2">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}