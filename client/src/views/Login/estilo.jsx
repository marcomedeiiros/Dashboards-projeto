import React, { useState } from 'react';
import './estilo.css';

const LoginForm = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLoginSubmit = (e) => {
        e.preventDefault();

    };

    return (
        <div className="login-container">
            <form
                className="login-form"
                action="http://localhost:5000/"
                method="POST"
                onSubmit={handleLoginSubmit}
            >
                <p className="login-title">{isRegistering ? 'Crie sua conta' : 'Faça seu login'}</p>

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
                        placeholder="Digite seu usuário"
                    />
                </div>

                <div className="input-group">
                    <label className="input-label" htmlFor="password">Senha</label>
                    <input
                        className="input-field"
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Digite sua senha"
                    />
                </div>

                <button className="submit-btn" type="submit">{isRegistering ? 'Registrar' : 'Continuar'}</button>

                <div className="links">

                    <a className="link" href="#" onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? 'Já tem Acesso? Faça o Acesso' : 'Cadastrar Acesso'}
                    </a>

                    {!isRegistering && (
                        <a className="link" href="#">Esqueci minha senha</a>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LoginForm;