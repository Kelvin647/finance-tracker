import React from 'react';

const RecentTransactions = ({ transactions, onDelete }) => {
  return (
    <div className="card transactions-card">
      <h3>Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet. Add some using the form above.</p>
      ) : (
        <ul className="transaction-list">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-category">{transaction.category}</span>
                <span className="transaction-description">{transaction.description}</span>
              </div>
              <div className="transaction-amount-container">
                <span className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </span>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(transaction.id)}
                  title="Delete transaction"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentTransactions;