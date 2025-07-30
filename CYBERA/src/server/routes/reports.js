const express = require('express');
const router = express.Router();
const db = require('../db');

// Category report
router.get('/category-report', (req, res) => {
  const rows = db.prepare(`
    SELECT category, SUM(price) as total
    FROM sale_items
    GROUP BY category
  `).all();
  res.json(rows);
});

module.exports = router;