import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyTrends = ({ transactions }) => {
  // Process transactions data for monthly trends
  const monthlyData = {};
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { income: 0, expense: 0 };
    }
    
    if (transaction.type === 'income') {
      monthlyData[monthYear].income += transaction.amount;
    } else {
      monthlyData[monthYear].expense += transaction.amount;
    }
  });

  const sortedMonths = Object.keys(monthlyData).sort();
  const labels = sortedMonths.map(month => {
    const [year, monthNum] = month.split('-');
    return new Date(year, monthNum - 1).toLocaleDateString('default', { month: 'short', year: 'numeric' });
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: sortedMonths.map(month => monthlyData[month].income),
        borderColor: '#4cc9f0',
        backgroundColor: 'rgba(76, 201, 240, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Expenses',
        data: sortedMonths.map(month => monthlyData[month].expense),
        borderColor: '#f72585',
        backgroundColor: 'rgba(247, 37, 133, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Trends',
      },
    },
  };

  return (
    <div className="card">
      <h3>Monthly Trends</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default MonthlyTrends;