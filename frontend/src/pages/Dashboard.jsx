import React, { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const FinanceDashboard = () => {
  const [timeRange, setTimeRange] = useState('Last 7 days');
  const [selectedFilters, setSelectedFilters] = useState(['Income', 'Expenses', 'Investments']);
  const [showForm, setShowForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Sample initial data
  const [financialData, setFinancialData] = useState({
    balance: 12543.67,
    transactions: [
      { id: 1, category: 'Salary', amount: 3500, type: 'income', date: '2023-10-10', description: 'Monthly salary' },
      { id: 2, category: 'Rent', amount: 1200, type: 'expense', date: '2023-10-11', description: 'Apartment rent' },
      { id: 3, category: 'Investments', amount: 500, type: 'income', date: '2023-10-12', description: 'Stock dividends' },
      { id: 4, category: 'Groceries', amount: 235.50, type: 'expense', date: '2023-10-12', description: 'Weekly groceries' },
    ],
    categories: {
      income: ['Salary', 'Freelance', 'Investments', 'Other'],
      expense: ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Transport']
    }
  });

  // Calculate derived data
  const incomeTotal = financialData.transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expenseTotal = financialData.transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentBalance = incomeTotal - expenseTotal;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    };

    setFinancialData(prev => ({
      ...prev,
      transactions: [...prev.transactions, transaction],
      balance: newTransaction.type === 'income' 
        ? prev.balance + transaction.amount 
        : prev.balance - transaction.amount
    }));

    // Reset form
    setNewTransaction({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    const txToDelete = financialData.transactions.find(tx => tx.id === id);
    setFinancialData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(tx => tx.id !== id),
      balance: txToDelete.type === 'income'
        ? prev.balance - txToDelete.amount
        : prev.balance + txToDelete.amount
    }));
  };

  return (
    <div className="genomics-inspired-dashboard">
      <header className="dashboard-header">
        <h1>MY Finance</h1>
        <div className="time-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last quarter</option>
            <option>Custom range</option>
          </select>
        </div>
      </header>

      {/* Add Transaction Button */}
      <div className="add-transaction-container">
        <button 
          className="add-transaction-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <div className="transaction-form-panel">
          <h2>Add New Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type:</label>
              <select 
                name="type" 
                value={newTransaction.type}
                onChange={handleInputChange}
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="Others">Other Income</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category:</label>
              <select
                name="category"
                value={newTransaction.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {newTransaction.type === 'income' 
                  ? financialData.categories.income.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  : financialData.categories.expense.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                }
              </select>
            </div>

            <div className="form-group">
              <label>Amount ($):</label>
              <input
                type="number"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Add Transaction
            </button>
          </form>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Filters Panel */}
        <div className="panel filters-panel">
          <h2>Filters</h2>
          <div className="filter-group">
            <h3>Transaction Types</h3>
            {['Income', 'Expenses', 'Investments', 'Savings'].map(filter => (
              <label key={filter}>
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter)}
                  onChange={() => setSelectedFilters(prev => 
                    prev.includes(filter) 
                      ? prev.filter(f => f !== filter) 
                      : [...prev, filter]
                  )}
                />
                {filter}
              </label>
            ))}
          </div>
          <div className="filter-dates">
            <p>Oct 10, 18:00</p>
            <p>Oct 17, 18:00</p>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="panel balance-panel">
          <h2>Balance Overview</h2>
          <div className="balance-metric">
            <h3>Current Balance</h3>
            <p className="balance-amount">${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="balance-details">
            <div>
              <h3>Income</h3>
              <p>${incomeTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <h3>Expenses</h3>
              <p>${expenseTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        {/* Transaction Categories */}
        <div className="panel categories-panel">
          <h2>Spending Categories</h2>
          <div className="doughnut-chart">
            <Doughnut
              data={{
                labels: financialData.categories.expense,
                datasets: [{
                  data: financialData.categories.expense.map(cat => 
                    financialData.transactions
                      .filter(tx => tx.type === 'expense' && tx.category === cat)
                      .reduce((sum, tx) => sum + tx.amount, 0)
                  ),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                }]
              }}
            />
          </div>
          <div className="category-details">
            {financialData.categories.expense.map(cat => {
              const total = financialData.transactions
                .filter(tx => tx.type === 'expense' && tx.category === cat)
                .reduce((sum, tx) => sum + tx.amount, 0);
              const percentage = expenseTotal > 0 ? (total / expenseTotal * 100).toFixed(1) : 0;
              return total > 0 ? (
                <p key={cat}>{cat}: ${total.toFixed(2)} ({percentage}%)</p>
              ) : null;
            })}
          </div>
        </div>

        {/* Cash Flow */}
        <div className="panel cashflow-panel">
          <h2>Cash Flow</h2>
          <div className="bar-chart">
            <Bar
              data={{
                labels: ['Oct 10', 'Oct 11', 'Oct 12', 'Oct 13'],
                datasets: [
                  {
                    label: 'Income',
                    data: [3500, 0, 500, 0], // Would be dynamic in real app
                    backgroundColor: '#4CC9F0'
                  },
                  {
                    label: 'Expenses',
                    data: [0, 1200, 235.5, 0], // Would be dynamic in real app
                    backgroundColor: '#F72585'
                  }
                ]
              }}
              options={{
                responsive: true,
                scales: {
                  x: { stacked: true },
                  y: { stacked: true }
                }
              }}
            />
          </div>
          <div className="cashflow-details">
            <p>Net: ${(incomeTotal - expenseTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Last {timeRange.toLowerCase()}</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="panel transactions-panel">
          <h2>Recent Transactions</h2>
          <div className="transactions-list">
            {financialData.transactions.slice().reverse().map(tx => (
              <div key={tx.id} className="transaction-item">
                <div>
                  <h3>{tx.category}</h3>
                  <p>{tx.description || 'No description'}</p>
                  <small>{tx.date}</small>
                </div>
                <div className="transaction-right">
                  <p className={`amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteTransaction(tx.id)}
                    title="Delete transaction"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="transactions-summary">
            <p>Total: {financialData.transactions.length} transactions</p>
            <p>${incomeTotal.toFixed(2)} income / ${expenseTotal.toFixed(2)} expenses</p>
          </div>
        </div>

        {/* Savings Goals */}
        <div className="panel savings-panel">
          <h2>Savings Progress</h2>
          <div className="savings-metric">
            <h3>Emergency Fund</h3>
            <p>${Math.min(currentBalance, 5000).toFixed(2)} / $5,000</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(currentBalance / 5000 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="savings-details">
            <p>{Math.min(currentBalance / 5000 * 100, 100).toFixed(1)}% complete</p>
            <p>${(5000 - currentBalance).toFixed(2)} remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;