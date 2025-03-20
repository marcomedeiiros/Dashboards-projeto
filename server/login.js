const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let usuarioAutenticado = null;  

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;


    const query = 'SELECT * FROM users WHERE usuario = ? AND senha = ?';

    db.query(query, [usuario, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao realizar login' });
        }

        if (results.length > 0) {

            usuarioAutenticado = usuario;
            res.status(200).json({ message: 'Login realizado com sucesso!' });
        } else {
            res.status(400).json({ message: 'Usuário ou senha incorretos' });
        }
    });
});

const verificarAutenticacao = (req, res, next) => {
    if (!usuarioAutenticado) {
        return res.status(403).json({ message: 'Você precisa estar logado para acessar esta página.' });
    }
    next();  
};

app.get('/membros', verificarAutenticacao, (req, res) => {
    const query = 'SELECT * FROM membros';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao recuperar membros' });
        }
        res.status(200).json(results);
    });
});

app.post('/add-membro', verificarAutenticacao, (req, res) => {
    const { nome, cargo, email } = req.body;

    if (!nome || !cargo || !email) {
        return res.status(400).json({ message: 'Todos os campos (nome, cargo, email) são obrigatórios.' });
    }

    const query = 'INSERT INTO membros (nome, cargo, email) VALUES (?, ?, ?)';

    db.query(query, [nome, cargo, email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao adicionar membro' });
        }
        res.status(201).json({ message: 'Membro adicionado com sucesso!' });
    });
});

app.put('/update-membro/:id', verificarAutenticacao, (req, res) => {
    const { id } = req.params;
    const { nome, cargo, email } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
    }

    const query = 'UPDATE membros SET nome = ?, cargo = ?, email = ? WHERE id = ?';

    db.query(query, [nome, cargo, email, id], (err, results) => {
        if (err) {
            console.error('Erro ao executar a query:', err);
            return res.status(500).json({ message: 'Erro ao atualizar membro' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Membro não encontrado' });
        }

        res.status(200).json({ message: 'Membro atualizado com sucesso!' });
    });
});

app.delete('/delete-membro/:id', verificarAutenticacao, (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
    }

    const query = 'DELETE FROM membros WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao executar a query:', err);
            return res.status(500).json({ message: 'Erro ao deletar membro' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Membro não encontrado' });
        }

        res.status(200).json({ message: 'Membro deletado com sucesso!' });
    });
});

app.post('/register', (req, res) => {
    const { usuario, senha } = req.body;

    const checkQuery = 'SELECT * FROM users WHERE usuario = ?';

    db.query(checkQuery, [usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao verificar usuário' });
        }

        if (results.length > 0) {
            res.status(400).json({ message: 'Usuário já existe' });
        } else {
            const insertQuery = 'INSERT INTO users (usuario, senha) VALUES (?, ?)';

            db.query(insertQuery, [usuario, senha], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Erro ao registrar usuário' });
                }
                res.status(200).json({ message: 'Usuário registrado com sucesso!' });
            });
        }
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});