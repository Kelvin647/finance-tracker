// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: ['https://kelvin647.github.io', 'http://localhost:3000']
}));
app.use(express.json());

// MongoDB Connection
const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://Kelvin:<db_password>@cluster0.dete2fl.mongodb.net/finance-tracker?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(DB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Connection error:', err));

// Transaction Model
const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  category: String
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// API Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const transaction = new Transaction({
    description: req.body.description,
    amount: req.body.amount,
    category: req.body.category
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));