const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// SQLite DB setup
const dbPath = path.resolve(__dirname, 'pos.db');
const db = new sqlite3(dbPath);

// Create sales table if not exists
const initTable = `CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;
db.prepare(initTable).run();

// Save sale to DB
app.post('/save-sale', (req, res) => {
  const { sessions, items } = req.body;
  const entry = { sessions, items };
  const stmt = db.prepare('INSERT INTO sales (data) VALUES (?)');
  stmt.run(JSON.stringify(entry));
  res.sendStatus(200);
});

// Utility: Category totals
const getCategoryTotals = (products) => {
  const totals = {};
  products.forEach(p => {
    if (!totals[p.category]) totals[p.category] = 0;
    totals[p.category] += p.price;
  });
  return totals;
};

// Generate PDF receipt
app.post('/generate-receipt', (req, res) => {
  const { sessions, items, total } = req.body;
  const categoryTotals = getCategoryTotals(items);

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-disposition', 'inline; filename="receipt.pdf"');
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);

  // Header
  if (fs.existsSync('public/logo.png')) {
    doc.image('public/logo.png', 450, 30, { width: 60 });
  }
  doc.fontSize(20).text('Cyber Café Receipt', 40, 40);
  doc.fontSize(10).fillColor('gray').text(new Date().toLocaleString(), 40, 65);
  doc.moveDown().moveTo(40, 90).lineTo(550, 90).stroke();

  doc.moveDown();

  // Sessions
  sessions.forEach(s => {
    doc.fontSize(12).fillColor('black').text(`Session: ${s.computer} - ${s.duration} min - KES ${s.charge}`);
  });

  // Products
  items.forEach(p => {
    doc.text(`Product: ${p.name} (${p.category}) - KES ${p.price}`);
  });

  // Category Totals
  doc.moveDown().fontSize(12).text('Sales by Category:', { underline: true });
  Object.entries(categoryTotals).forEach(([cat, amount]) => {
    doc.text(`${cat}: KES ${amount.toFixed(2)}`);
  });

  // Total
  doc.moveDown().fontSize(14).text(`TOTAL: KES ${total}`, { align: 'right' });

  // Footer
  doc.moveDown().fontSize(10).fillColor('gray').text('Thank you for choosing our cyber café!', { align: 'center' });

  doc.end();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
