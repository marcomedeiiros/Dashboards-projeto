import React, { useState } from 'react';
import './estilo.css';
import { useNavigate } from 'react-router-dom'; // Importando o useNavigate

const LoginForm = () => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Inicializando o useNavigate

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); // Mensagem de sucesso
                navigate('/Dashboard'); // Redireciona para o Dashboard
            } else {
                setError(data.message); // Exibe a mensagem de erro
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error);
            setError('Erro na conexão com o servidor');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleLoginSubmit}>
                <p className="auth-title">Faça seu login</p>

                {error && <div className="error-msg">{error}</div>} {/* Exibe o erro caso haja */}

                <div className="input-wrapper">
                    <label className="input-label" htmlFor="usuario">Usuário</label>
                    <input
                        className="input-field"
                        type="text"
                        id="usuario"
                        name="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                        placeholder="Digite seu usuário"
                    />
                </div>

                <div className="input-wrapper">
                    <label className="input-label" htmlFor="senha">Senha</label>
                    <input
                        className="input-field"
                        type="password"
                        id="senha"
                        name="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        placeholder="Digite sua senha"
                    />
                </div>

                <button className="submit-button" type="submit">Continuar</button>

                <div className="auth-links">
                    <a className="auth-link" href="#">Esqueci meu Acesso</a>
                    <a className="auth-link" href="/registro">Crie um Acesso</a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;