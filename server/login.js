const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); 

const app = express();
const port = 5000;

app.use(cors()); 
app.use(bodyParser.json()); 

// Rota de login
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    const query = 'SELECT * FROM users WHERE usuario = ? AND senha = ?';

    db.query(query, [usuario, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao realizar login' });
        }
        
        if (results.length > 0) {

            res.status(200).json({ message: 'Login realizado com sucesso!' });
        } else {

            res.status(400).json({ message: 'Usuário ou senha incorretos' });
        }
    });
});


app.post('/register', (req, res) => {
    const { usuario, senha } = req.body;

    console.log('Recebendo dados:', { usuario, senha }); // Log para depuração

    const checkQuery = 'SELECT * FROM users WHERE usuario = ?';

    db.query(checkQuery, [usuario], (err, results) => {
        if (err) {
            console.log('Erro ao verificar usuário:', err); // Log do erro
            return res.status(500).json({ message: 'Erro ao verificar usuário' });
        }

        if (results.length > 0) {
            res.status(400).json({ message: 'Usuário já existe' });
        } else {
            const insertQuery = 'INSERT INTO users (usuario, senha) VALUES (?, ?)';
            
            db.query(insertQuery, [usuario, senha], (err, results) => {
                if (err) {
                    console.log('Erro ao registrar usuário:', err); // Log do erro
                    return res.status(500).json({ message: 'Erro ao registrar usuário' });
                }
                console.log('Usuário registrado com sucesso!');
                res.status(200).json({ message: 'Usuário registrado com sucesso!' });
            });
        }
    });
});


// run server
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
