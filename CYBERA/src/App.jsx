import './App.css';
import { useState, useEffect } from 'react';
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
        <SessionInput
          sessions={sessions}
          computer={computer}
          duration={duration}
          setComputer={setComputer}
          setDuration={setDuration}
          addSession={addSession}
          removeSession={removeSession}
        />
        <ProductInput
          inventory={inventory}
          productName={productName}
          setProductName={setProductName}
          productPrice={productPrice}
          productCategory={productCategory}
          setProductPrice={setProductPrice}
          setProductCategory={setProductCategory}
          addProduct={addProduct}
          products={products}
          removeProduct={removeProduct}
        />
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
