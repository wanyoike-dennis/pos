import './App.css';
import { useState, useEffect } from 'react';
import { Monitor, PlusCircle, Trash2, ReceiptText } from 'lucide-react';
import Header from './components/Header';
import SessionInput from './components/SessionInput';
import ProductInput from './components/ProductInput';
import InventoryManager from './components/InventoryManager';
import SalesSummary from './components/SalesSummary';
import TotalBar from './components/TotalBar';
import ReceiptPreview from './components/ReceiptPreview';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PosApp() {
  // Load from localStorage or default to []
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });
  const [computer, setComputer] = useState('');
  const [duration, setDuration] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('Printing');
  const [darkMode, setDarkMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Inventory state
  const [inventory, setInventory] = useState([]);
  const [invName, setInvName] = useState('');
  const [invCategory, setInvCategory] = useState('Printing');
  const [invPrice, setInvPrice] = useState('');
  const [invQty, setInvQty] = useState('');

  const categories = ['All', 'Printing', 'Typing', 'Browsing', 'Other'];
  const currentDate = new Date().toLocaleString();

  // Fetch inventory from backend
  useEffect(() => {
    fetch(`${API}/inventory`)
      .then(res => res.json())
      .then(setInventory)
      .catch(() => setInventory([]));
  }, []);

  // Save sessions/products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const addSession = () => {
    if (!computer || !duration || duration <= 0) return alert("Enter valid computer name and duration");
    const charge = Math.ceil(duration / 20) * 20;
    setSessions([...sessions, { computer, duration, charge }]);
    setComputer('');
    setDuration('');
  };

  // Add product from inventory
  const addProduct = () => {
    if (!productName) return alert("Select a product from inventory");
    const invItem = inventory.find(i => i.name === productName);
    if (!invItem) return alert("Product not found in inventory");
    if (invItem.quantity <= 0) return alert("Out of stock");
    setProducts([...products, { name: invItem.name, price: invItem.price, category: invItem.category }]);
    setProductName('');
    setProductPrice('');
    setProductCategory('Printing');
  };

  // Add or update inventory item
  const addInventory = async () => {
    if (!invName || !invPrice || !invQty) return alert('Fill all inventory fields');
    await fetch(`${API}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: invName,
        category: invCategory,
        price: parseFloat(invPrice),
        quantity: parseInt(invQty)
      })
    });
    setInvName(''); setInvCategory('Printing'); setInvPrice(''); setInvQty('');
    // Refresh inventory
    fetch(`${API}/inventory`).then(res => res.json()).then(setInventory);
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
  const filteredTotal = [...sessions.map(s => s.charge), ...filteredProducts.map(p => p.price)].reduce((a, b) => a + b, 0);

  const categoryTotals = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.price;
    return acc;
  }, {});

  const hasData = sessions.length > 0 || products.length > 0;

  const generateReceipt = async () => {
    if (!hasData) return;

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
    // Refresh inventory after sale
    fetch(`${API}/inventory`).then(res => res.json()).then(setInventory);
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all entries?")) {
      setSessions([]);
      setProducts([]);
    }
  };

  return (
    <div className={`transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} min-h-screen p-6 font-sans`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
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
      <InventoryManager
        invName={invName}
        setInvName={setInvName}
        invPrice={invPrice}
        setInvPrice={setInvPrice}
        invQty={invQty}
        setInvQty={setInvQty}
        invCategory={invCategory}
        setInvCategory={setInvCategory}
        addInventory={addInventory}
        inventory={inventory}
        categories={categories}
      />
      {hasData && <SalesSummary categoryTotals={categoryTotals} />}
      <TotalBar
        total={total}
        hasData={hasData}
        setShowPreview={setShowPreview}
        generateReceipt={generateReceipt}
        clearAll={clearAll}
      />
      <ReceiptPreview
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        currentDate={currentDate}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sessions={sessions}
        filteredProducts={filteredProducts}
        filteredTotal={filteredTotal}
      />
    </div>
  );
}
