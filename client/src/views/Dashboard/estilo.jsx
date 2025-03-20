import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import './estilo.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {

  const data = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'], 
    datasets: [
      {
        label: 'Vendas', 
        data: [65, 59, 80, 81, 56],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'hsl(180, 48.10%, 52.40%)', 
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true, 
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true, 
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Relátorio de vendas</h1>
      <div className="chart-wrapper">
        <Bar data={data} options={options} className="dashboard-chart" />
      </div>
    </div>
  );
};

export default Dashboard;