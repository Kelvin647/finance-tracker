import React, { useContext, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetCard = () => {
  const { user } = useContext(AuthContext);
  const [budgetData, setBudgetData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
    }]
  });
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Fetch transactions for the current month
        const res = await axios.get('/api/transactions', config);
        const transactions = res.data;
        
        // Calculate budget data by category
        const categories = {};
        transactions.forEach(transaction => {
          if (transaction.type === 'expense') {
            if (!categories[transaction.category]) {
              categories[transaction.category] = 0;
            }
            categories[transaction.category] += transaction.amount;
          }
        });
        
        // Prepare data for chart
        const labels = Object.keys(categories);
        const data = Object.values(categories);
        const backgroundColors = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'
        ];
        
        setBudgetData({
          labels,
          datasets: [{
            data,
            backgroundColor: backgroundColors.slice(0, labels.length),
          }]
        });
        
        // Calculate totals
        const spent = data.reduce((sum, amount) => sum + amount, 0);
        setTotalSpent(spent);
        // For demo purposes, we'll set a sample budget
        // In a real app, you would fetch this from your backend
        setTotalBudget(3000); // Example budget amount
      } catch (err) {
        console.error('Error fetching budget data:', err);
      }
    };

    if (user) {
      fetchBudgetData();
    }
  }, [user]);

  const remainingBudget = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="card budget-card">
      <h3>Monthly Budget</h3>
      
      <div className="budget-summary">
        <div className="budget-metric">
          <span className="metric-label">Total Budget:</span>
          <span className="metric-value">${totalBudget.toFixed(2)}</span>
        </div>
        <div className="budget-metric">
          <span className="metric-label">Spent:</span>
          <span className="metric-value spent">${totalSpent.toFixed(2)}</span>
        </div>
        <div className="budget-metric">
          <span className="metric-label">Remaining:</span>
          <span className={`metric-value ${remainingBudget >= 0 ? 'remaining' : 'overspent'}`}>
            ${remainingBudget.toFixed(2)}
          </span>
        </div>
        <div className="budget-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            ></div>
          </div>
          <span className="progress-text">{percentageUsed}% used</span>
        </div>
      </div>
      
      <div className="budget-chart">
        <Doughnut 
          data={budgetData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const percentage = Math.round((value / totalSpent) * 100);
                    return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default BudgetCard;