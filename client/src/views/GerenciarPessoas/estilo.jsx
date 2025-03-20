import React, { useState, useEffect } from 'react';
import './estilo.css';
import { useNavigate } from 'react-router-dom';

const GerenciarMembros = () => {
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/membros')
      .then((response) => response.json())
      .then((data) => {
        setMembros(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar membros:', error);
        setLoading(false);
      });
  }, []);

  const handleUpdate = () => {
    if (!nome || !cargo || !email) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    const updatedMembro = { nome, cargo, email };

    fetch(`http://localhost:5000/update-membro/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMembro),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Membro atualizado com sucesso!') {
          setMembros(membros.map((membro) =>
            membro.id === editId ? { ...membro, nome, cargo, email } : membro
          ));
          setNome('');
          setCargo('');
          setEmail('');
          setEditId(null);
          setError('');
        } else {
          alert('Erro ao atualizar membro.');
        }
      })
      .catch((error) => {
        console.error('Erro ao atualizar membro:', error);
        alert('Erro ao atualizar membro.');
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este membro?');
    if (confirmDelete) {
      fetch(`http://localhost:5000/delete-membro/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setMembros(membros.filter((membro) => membro.id !== id));
          } else {
            alert('Erro ao deletar membro.');
          }
        })
        .catch((error) => {
          console.error('Erro ao deletar membro:', error);
          alert('Erro ao deletar membro.');
        });
    }
  };

  const handleAddMembro = (e) => {
    e.preventDefault();

    if (!nome || !cargo || !email) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    const newMembro = { nome, cargo, email };

    fetch('http://localhost:5000/add-membro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMembro),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Membro adicionado com sucesso!') {
          setMembros([...membros, newMembro]);
          setNome('');
          setCargo('');
          setEmail('');
          setError('');
        } else {
          alert('Erro ao adicionar membro.');
        }
      })
      .catch((error) => {
        console.error('Erro ao adicionar membro:', error);
        alert('Erro ao adicionar membro.');
      });
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleManageParticipants = () => {
    navigate('/Dashboard');
  };

  const handleLogout = () => {
    
    alert('Sessão finalizada!');
  };

  if (loading) {
    return <div>Carregando membros...</div>;
  }

  return (
    <div className="membros-list">
      <h2>Gerenciamento de Membros da Empresa</h2>

      <div className="profile-container">
        <button className="profile-button" onClick={toggleDropdown}>
          <i className="fa fa-user"></i> 
        </button>

        {isDropdownVisible && (
          <div className="dropdown-menu">
            <button className="dropdown-item">Perfil</button>            
            <button className="dropdown-item" onClick={handleManageParticipants}>
              Gerenciar Vendas
            </button>
            <button className="dropdown-item" onClick={handleLogout}>
              Finalizar Sessão
            </button>
          </div>
        )}
      </div>

      <form onSubmit={editId ? handleUpdate : handleAddMembro} className="form-add-membro">
        <h3>{editId ? 'Editar Membro' : 'Adicionar Novo Membro'}</h3>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cargo"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">{editId ? 'Atualizar Membro' : 'Adicionar Membro'}</button>
      </form>

      <ul>
        {membros.map((membro) => (
          <li key={membro.id}>
            <span>{membro.nome} - {membro.cargo} - {membro.email}</span>
            <button onClick={() => {
              setEditId(membro.id);
              setNome(membro.nome);
              setCargo(membro.cargo);
              setEmail(membro.email);
            }}>Editar</button>
            <button onClick={() => handleDelete(membro.id)}>Deletar Membro</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GerenciarMembros;