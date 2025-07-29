import { useState } from 'react';
import './App.css';
//import { useState } from 'react';
import { Monitor, ReceiptText, PlusCircle, Trash2, Moon, Sun, Printer } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PosApp() {
  const [sessions, setSessions] = useState([]);
  const [products, setProducts] = useState([]);
  const [computer, setComputer] = useState('');
  const [duration, setDuration] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('Printing');
  const [darkMode, setDarkMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Printing', 'Typing', 'Browsing', 'Other'];
  const currentDate = new Date().toLocaleString();

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const addSession = () => {
    const charge = Math.ceil(duration / 30) * 20;
    setSessions([...sessions, { computer, duration, charge }]);
    setComputer('');
    setDuration('');
  };

  const addProduct = () => {
    setProducts([...products, { name: productName, price: parseFloat(productPrice), category: productCategory }]);
    setProductName('');
    setProductPrice('');
    setProductCategory('Printing');
  };

  const removeSession = (index) => {
    const updated = [...sessions];
    updated.splice(index, 1);
    setSessions(updated);
  };

  const removeProduct = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const total = [...sessions.map(s => s.charge), ...products.map(p => p.price)].reduce((a, b) => a + b, 0);

  const categoryTotals = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.price;
    return acc;
  }, {});

  const hasData = sessions.length > 0 || products.length > 0;

  const generateReceipt = async () => {
    setShowPreview(false);
    await fetch(`${API}/save-sale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessions, items: products })
    });

    const res = await fetch(`${API}/generate-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessions, items: products, total })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className={`transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} min-h-screen p-6 font-sans`}>
      <header className="text-center flex flex-col items-center gap-2">
        <img src="/logo.png" alt="Cyber Café Logo" className="w-14 h-14 rounded-full shadow-md" />
        <h1 className="text-4xl font-extrabold tracking-tight text-blue-700 dark:text-blue-300">Cyber Café POS</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">Fast & simple billing system</p>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />} {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Session Input */}
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow-md">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Monitor size={20} /> New Session
          </h2>
          <div className="space-y-3">
            <input className="input" value={computer} onChange={e => setComputer(e.target.value)} placeholder="Computer Name" />
            <input className="input" type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (min)" />
            <button onClick={addSession} className="btn-blue"><PlusCircle size={18} /> Add Session</button>
          </div>
          <ul className="mt-4 text-sm text-gray-800 dark:text-gray-200 space-y-1">
            {sessions.map((s, i) => (
              <li key={i} className="flex justify-between items-center">
                {s.computer} - {s.duration} min - KES {s.charge}
                <button onClick={() => removeSession(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Input */}
        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow-md">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <ReceiptText size={20} /> New Product/Service
          </h2>
          <div className="space-y-3">
            <input className="input" value={productName} onChange={e => setProductName(e.target.value)} placeholder="Name" />
            <input className="input" type="number" value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder="Price" />
            <select className="input" value={productCategory} onChange={e => setProductCategory(e.target.value)}>
              {categories.slice(1).map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
            <button onClick={addProduct} className="btn-blue"><PlusCircle size={18} /> Add Product</button>
          </div>
          <ul className="mt-4 text-sm text-gray-800 dark:text-gray-200 space-y-1">
            {products.map((p, i) => (
              <li key={i} className="flex justify-between items-center">
                {p.name} - KES {p.price} ({p.category})
                <button onClick={() => removeProduct(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Category Summary */}
      {hasData && (
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
      )}

      {/* Total and Preview */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md text-center mt-6">
        <h2 className="font-bold text-xl text-gray-800 dark:text-white">
          Total: <span className="text-green-600 dark:text-green-400">KES {total}</span>
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <button onClick={() => setShowPreview(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium flex items-center gap-2">
            <Printer size={18} /> Preview Receipt
          </button>
          <button onClick={generateReceipt} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium flex items-center gap-2">
            <Printer size={18} /> Generate Receipt
          </button>
        </div>

        {showPreview && (
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
              <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input">
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
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right">KES {total}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">Thank you for choosing our cyber café!</p>
          </div>
        )}
      </div>
    </div>
  );
}
