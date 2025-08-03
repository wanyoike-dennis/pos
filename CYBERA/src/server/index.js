const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const sqlite3 = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// SQLite setup
const dbPath = path.join(__dirname, 'pos.db');
const db = new sqlite3(dbPath);

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    sessions TEXT,
    items TEXT,
    total REAL
  )
`).run();

// Save sale data to DB
app.post('/save-sale', (req, res) => {
  const { sessions = [], items = [] } = req.body;

  // Recalculate session charge: 1 KES per minute, min 10 KES
  const updatedSessions = sessions.map(s => {
    const duration = Number(s.duration);
    const charge = Math.max(duration, 10); // Enforce minimum
    return {
      computer: s.computer,
      duration,
      charge,
    };
  });

  const total =
    updatedSessions.reduce((sum, s) => sum + s.charge, 0) +
    items.reduce((sum, p) => sum + Number(p.price), 0);

  const stmt = db.prepare(`
    INSERT INTO sales (date, sessions, items, total)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(new Date().toISOString(), JSON.stringify(updatedSessions), JSON.stringify(items), total);

  res.json({ message: 'Sale saved', sessions: updatedSessions });
});

// Generate receipt PDF
app.post('/generate-receipt', (req, res) => {
  const { sessions = [], items = [], total } = req.body;

  const updatedSessions = sessions.map(s => {
    const duration = Number(s.duration);
    const charge = Math.max(duration, 10); // Same logic
    return {
      computer: s.computer,
      duration,
      charge,
    };
  });

  const doc = new PDFDocument({ size: 'A6', margin: 20 });
  const filename = `receipt-${Date.now()}.pdf`;

  res.setHeader('Content-disposition', `inline; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(16).text('Cyber Café Receipt', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Date: ${new Date().toLocaleString()}`);
  doc.moveDown();

  if (updatedSessions.length) {
    doc.fontSize(12).text('Sessions:', { underline: true });
    updatedSessions.forEach(s => {
      doc.text(`- ${s.computer}: ${s.duration} min — KES ${s.charge}`);
    });
    doc.moveDown();
  }

  if (items.length) {
    doc.fontSize(12).text('Products/Services:', { underline: true });
    items.forEach(p => {
      doc.text(`- ${p.name} (${p.category}): KES ${p.price}`);
    });
    doc.moveDown();
  }

  doc.fontSize(14).text(`Total: KES ${total}`, { align: 'right' });
  doc.moveDown().fontSize(10).text('Thank you for your visit!', { align: 'center' });

  doc.end();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
