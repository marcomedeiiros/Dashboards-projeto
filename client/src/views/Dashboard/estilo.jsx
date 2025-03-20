import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
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
import 'font-awesome/css/font-awesome.min.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();

  const [empresa, setEmpresa] = useState('');
  const [dataVenda, setDataVenda] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [vendas, setVendas] = useState([]);
  const [username, setUsername] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); 

  useEffect(() => {
    const user = localStorage.getItem('username') || sessionStorage.getItem('username');
    setUsername(user); 
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/vendas')
      .then(response => response.json())
      .then(data => {
        setVendas(data);
      })
      .catch(error => {
        console.error('Erro ao carregar vendas', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const novaVenda = {
      empresa,
      data_venda: dataVenda,
      quantidade: parseInt(quantidade),
    };

    fetch('http://localhost:5000/add-venda', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaVenda),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Venda adicionada:', data);

        fetch('http://localhost:5000/vendas')
          .then(response => response.json())
          .then(vendasData => {
            setVendas(vendasData);
          })
          .catch(error => {
            console.error('Erro ao carregar vendas após adicionar:', error);
          });

        setEmpresa('');
        setDataVenda('');
        setQuantidade('');
      })
      .catch(error => {
        console.error('Erro ao adicionar venda', error);
      });
  };

  const handleUpdate = (vendaId) => {
    const empresa = prompt('Informe o novo nome da empresa:');
    const dataVenda = prompt('Informe a nova data de venda:');
    const quantidade = prompt('Informe a nova quantidade de vendas:');

    if (empresa && dataVenda && quantidade) {
      const updatedVenda = {
        empresa,
        data_venda: dataVenda,
        quantidade: parseInt(quantidade),
      };

      fetch(`http://localhost:5000/update-venda/${vendaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVenda),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Venda atualizada:', data);
          fetch('http://localhost:5000/vendas')
            .then(response => response.json())
            .then(vendasData => {
              setVendas(vendasData);
            })
            .catch(error => {
              console.error('Erro ao carregar vendas após atualização:', error);
            });
        })
        .catch((error) => {
          console.error('Erro ao atualizar venda:', error);
        });
    }
  };

  const handleDelete = (vendaId) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar esta venda?');
    if (confirmDelete) {
      fetch(`http://localhost:5000/delete-venda/${vendaId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Venda deletada:', data);          
          fetch('http://localhost:5000/vendas')
            .then(response => response.json())
            .then(vendasData => {
              setVendas(vendasData);
            })
            .catch(error => {
              console.error('Erro ao carregar vendas após exclusão:', error);
            });
        })
        .catch((error) => {
          console.error('Erro ao deletar venda:', error);
        });
    }
  };

  const data = {
    labels: vendas.map((venda) => venda.empresa),
    datasets: [
      {
        label: 'Vendas',
        data: vendas.map((venda) => venda.quantidade),
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); 
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username'); 
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible); 
  };

  const handleManageParticipants = () => {
    navigate('/Gerenciar');
  };

  return (
    <div className="dashboard-container">
      <div className="button-container">
        <button className="profile-button" onClick={toggleDropdown}>
          <i className="fa fa-user"></i>
          {username && <span className="username">{username}</span>}
        </button>

        {isDropdownVisible && (
          <div className="dropdown-menu">
            <button className="dropdown-item">Perfil</button>
            <button className="dropdown-item" onClick={handleManageParticipants}>Gerenciar Membros da empresa</button>
            <button className="dropdown-item" onClick={handleLogout}>Finalizar Sessão</button>
          </div>
        )}
      </div>
      <h1 className="dashboard-title">Relátorio de vendas</h1>

      <div className="sale-form-container">
        <form className="sale-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome da empresa"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            required
          />
          <input
            type="date"
            value={dataVenda}
            onChange={(e) => setDataVenda(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Quantidade de vendas"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
          <button type="submit">Adicionar Venda</button>
        </form>
      </div>

      <div className="chart-wrapper">
        <Bar data={data} options={options} className="dashboard-chart" />
      </div>

      <div className="vendas-list">
        <h2>Vendas Cadastradas</h2>
        <ul>
          {vendas.map((venda) => (
            <li key={venda.id}>
              <span>{venda.empresa} - {venda.data_venda} - {venda.quantidade} vendas</span>
              <button onClick={() => handleUpdate(venda.id)}>Editar</button>
              <button onClick={() => handleDelete(venda.id)}>Deletar Venda</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
