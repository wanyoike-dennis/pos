const express = require('express');
const router = express.Router();
const generateReceiptPDF = require('../pdf');
const path = require('path');

router.post('/generate-receipt', (req, res) => {
  const fontPath = path.join(__dirname, '../Inter-Regular.ttf');
  generateReceiptPDF({ ...req.body, fontPath }, res);
});

module.exports = router;