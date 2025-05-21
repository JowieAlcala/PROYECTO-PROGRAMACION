const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const itemRoutes = require('./routes/items');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Rutes
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor arrencat al port ${PORT}`);
});