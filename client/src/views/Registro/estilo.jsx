import React, { useState } from 'react';
import imgs from '../../imgs/arrayImagens';
import './estilo.css';

const RegisterForm = () => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); 
                setUsuario(''); 
                setSenha(''); 
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error);
            setError('Erro na conexão com o servidor');
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegisterSubmit}>
            <img src={imgs.logoRegistrar} alt="logo-dashboard" className='register-title' />        
                {error && <div className="error-message">{error}</div>} 

                <div className="input-group">
                    <label className="input-label" htmlFor="usuario">Usuário</label>
                    <input
                        className="input-field"
                        type="text"
                        id="usuario"
                        name="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                        placeholder="Escolha seu usuário"
                    />
                </div>

                <div className="input-group">
                    <label className="input-label" htmlFor="senha">Senha</label>
                    <input
                        className="input-field"
                        type="password"
                        id="senha"
                        name="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        placeholder="Escolha sua senha"
                    />
                </div>

                <button className="submit-btn" type="submit" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrar'}
                </button> 

                <div className="links">
                    <a className="link" href="/">Já tem um acesso? Faça seu Acesso</a>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;