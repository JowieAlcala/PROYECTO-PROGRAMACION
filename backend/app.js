// backend/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./config/db');             // DB
const apiRoutes = require('./routes/api');  // Rutes

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Prefix per a totes les rutes d'API
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escoltant al port ${PORT}`);
});
