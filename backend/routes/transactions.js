const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getTransactions, addTransaction, deleteTransaction } = require('../controllers/transactionController');
const router = express.Router();

router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router.route('/:id')
  .delete(protect, deleteTransaction);

module.exports = router;