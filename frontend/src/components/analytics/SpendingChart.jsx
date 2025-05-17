import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SpendingChart = ({ transactions }) => {
  // Process transactions data for the chart
  const categories = {};
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      if (!categories[transaction.category]) {
        categories[transaction.category] = 0;
      }
      categories[transaction.category] += transaction.amount;
    }
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [{
      label: 'Spending by Category',
      data: Object.values(categories),
      backgroundColor: [
        '#4361ee', '#3f37c9', '#4895ef', '#4cc9f0',
        '#f72585', '#f8961e', '#4cc9f0', '#7209b7'
      ],
      borderColor: [
        '#4361ee', '#3f37c9', '#4895ef', '#4cc9f0',
        '#f72585', '#f8961e', '#4cc9f0', '#7209b7'
      ],
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Spending by Category',
      },
    },
  };

  return (
    <div className="card">
      <h3>Spending Analysis</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SpendingChart;