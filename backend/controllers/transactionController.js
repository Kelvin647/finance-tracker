const Transaction = require('../models/Transaction');
const asyncHandler = require('express-async-handler');

// @desc    Get all transactions for a user
// @route   GET /api/transactions
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id });
  res.json(transactions);
});

// @desc    Add new transaction
// @route   POST /api/transactions
const addTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, description } = req.body;
  
  const transaction = await Transaction.create({
    user: req.user.id,
    type,
    category,
    amount,
    description
  });
  
  res.status(201).json(transaction);
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  
  if (transaction.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  await transaction.remove();
  res.json({ message: 'Transaction removed' });
});

module.exports = { getTransactions, addTransaction, deleteTransaction };