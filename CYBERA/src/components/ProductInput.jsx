import { ReceiptText, PlusCircle, Trash2 } from 'lucide-react';

export default function ProductInput({
  inventory, productName, setProductName, productPrice, productCategory, setProductPrice, setProductCategory,
  addProduct, products, removeProduct
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow-md">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <ReceiptText size={20} /> Add Product/Service from Inventory
      </h2>
      <div className="space-y-3">
        <select
          className="input w-full bg-white dark:bg-gray-900 text-black dark:text-white"
          value={productName}
          onChange={e => {
            setProductName(e.target.value);
            const invItem = inventory.find(i => i.name === e.target.value);
            if (invItem) {
              setProductPrice(invItem.price);
              setProductCategory(invItem.category);
            } else {
              setProductPrice('');
              setProductCategory('Printing');
            }
          }}
        >
          <option value="">Select Product</option>
          {inventory.map(item => (
            <option key={item.id} value={item.name}>
              {item.name} ({item.category}) - KES {item.price} [{item.quantity} left]
            </option>
          ))}
        </select>
        <input
          className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 dark:placeholder-gray-300 text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
          value={productPrice}
          placeholder="Price"
          disabled
        />
        <input
          className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 dark:placeholder-gray-300 text-sm bg-white dark:bg-gray-900 text-black dark:text-white"
          value={productCategory}
          placeholder="Category"
          disabled
        />
        <button onClick={addProduct} className="btn-blue"><PlusCircle size={18} /> Add Product</button>
      </div>
      <ul className="mt-4 text-sm text-gray-800 dark:text-gray-200 space-y-1">
        {products.length === 0 && <p className="text-gray-400 italic">No products added.</p>}
        {products.map((p, i) => (
          <li key={i} className="flex justify-between items-center">
            {p.name} - KES {p.price} ({p.category})
            <button onClick={() => removeProduct(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}