const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateReceiptPDF({ sessions = [], items = [], total, fontPath }, res) {
  const updatedSessions = sessions.map(s => {
    const duration = Number(s.duration);
    const charge = Math.max(duration, 10);
    return { ...s, duration, charge };
  });

  const doc = new PDFDocument({ size: 'A6', margin: 20 });
  const filename = `receipt-${Date.now()}.pdf`;

  res.setHeader('Content-disposition', `inline; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);

  if (fontPath && fs.existsSync(fontPath)) {
    doc.registerFont('Inter', fontPath).font('Inter');
  } else {
    doc.font('Helvetica');
  }

  doc
    .fontSize(14)
    .fillColor('#1d4ed8')
    .text('CYBER CAFÉ POS', { align: 'center', underline: true })
    .moveDown(0.2);

  doc
    .fontSize(9)
    .fillColor('#555')
    .text(`Date: ${new Date().toLocaleString()}`, { align: 'center' })
    .moveDown(0.6);

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke('#e5e7eb')
    .moveDown(0.4);

  if (updatedSessions.length > 0) {
    doc.fontSize(10).fillColor('#000').text('Sessions:', { underline: true });
    updatedSessions.forEach(s => {
      doc
        .text(`${s.computer}`, { continued: true })
        .text(`  | ${s.duration} min`, { continued: true })
        .text(`  | KES ${s.charge.toFixed(2)}`, { align: 'right' });
    });
    doc.moveDown(0.4);
  }

  if (items.length > 0) {
    doc.fontSize(10).fillColor('#000').text('Products/Services:', { underline: true });
    items.forEach(p => {
      doc
        .text(`${p.name} (${p.category})`, { continued: true })
        .text(`  | KES ${Number(p.price).toFixed(2)}`, { align: 'right' });
    });
    doc.moveDown(0.4);
  }

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke('#e5e7eb')
    .moveDown(0.3);

  doc
    .fontSize(11)
    .fillColor('#16a34a')
    .text(`Total:`, { continued: true })
    .text(`KES ${Number(total).toFixed(2)}`, { align: 'right' })
    .moveDown(1);

  doc
    .fontSize(8)
    .fillColor('#888')
    .text('Thank you for choosing our cyber café!', { align: 'center' });

  doc.end();
}

module.exports = generateReceiptPDF;