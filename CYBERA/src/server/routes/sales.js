const express = require('express');
const router = express.Router();
const db = require('../db');

// Save sale and update inventory
router.post('/save-sale', (req, res) => {
  const { sessions = [], items = [] } = req.body;

  const fixedSessions = sessions.map(s => ({
    computer: s.computer,
    duration: parseInt(s.duration),
    charge: Math.max(parseInt(s.duration), 10),
  }));

  const total =
    fixedSessions.reduce((sum, s) => sum + s.charge, 0) +
    items.reduce((sum, p) => sum + Number(p.price), 0);

  const saleStmt = db.prepare('INSERT INTO sales (date, total) VALUES (?, ?)');
  const saleResult = saleStmt.run(new Date().toISOString(), total);
  const saleId = saleResult.lastInsertRowid;

  const sessionStmt = db.prepare('INSERT INTO sessions (sale_id, computer, duration, charge) VALUES (?, ?, ?, ?)');
  fixedSessions.forEach(s =>
    sessionStmt.run(saleId, s.computer, s.duration, s.charge)
  );

  const productStmt = db.prepare('INSERT INTO sale_items (sale_id, name, price, category) VALUES (?, ?, ?, ?)');
  const updateStockStmt = db.prepare('UPDATE inventory SET quantity = quantity - ? WHERE name = ? AND quantity >= ?');

  items.forEach(p => {
    productStmt.run(saleId, p.name, p.price, p.category);
    updateStockStmt.run(qty, p.name, qty); // Decrease stock
  });

  res.json({ message: 'Sale saved', saleId });
});

// Sales history
router.get('/sales-history', (req, res) => {
  const sales = db.prepare('SELECT * FROM sales ORDER BY id DESC').all();
  res.json(sales);
});

module.exports = router;