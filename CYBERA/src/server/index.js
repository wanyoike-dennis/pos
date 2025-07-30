const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const inventoryRoutes = require('./routes/inventory');
const salesRoutes = require('./routes/sales');
const reportsRoutes = require('./routes/reports');
const pdfRoutes = require('./routes/pdf');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/inventory', inventoryRoutes);
app.use('/sales', salesRoutes);
app.use('/reports', reportsRoutes);
app.use('/', pdfRoutes); // PDF route

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
