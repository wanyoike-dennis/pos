const express = require('express');
const router = express.Router();
const db = require('../db');

// Get inventory
router.get('/', (req, res) => {
  const items = db.prepare('SELECT * FROM inventory ORDER BY name ASC').all();
  res.json(items);
});

// Add/update inventory item
router.post('/', (req, res) => {
  const { name, category, price, quantity } = req.body;
  const stmt = db.prepare(`
    INSERT INTO inventory (name, category, price, quantity)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
      category = excluded.category,
      price = excluded.price,
      quantity = quantity + excluded.quantity
  `);
  stmt.run(name, category, price, quantity);
  res.json({ message: 'Inventory updated' });
});

module.exports = router;