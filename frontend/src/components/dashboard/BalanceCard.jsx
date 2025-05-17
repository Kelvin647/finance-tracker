import React from 'react';

const BalanceCard = ({ balance }) => {
  const isPositive = balance >= 0;
  
  return (
    <div className="card balance-card">
      <div className="balance-header">
        <h3>Current Balance</h3>
        <i className={`fas fa-${isPositive ? 'arrow-up' : 'arrow-down'}`}></i>
      </div>
      <div className="balance-amount">
        ${Math.abs(balance).toFixed(2)}
      </div>
      <div className="balance-footer">
        {isPositive ? (
          <span className="balance-trend positive">
            <i className="fas fa-arrow-up"></i> Looking good!
          </span>
        ) : (
          <span className="balance-trend negative">
            <i className="fas fa-arrow-down"></i> Overspending
          </span>
        )}
      </div>
    </div>
  );
};

export default BalanceCard;