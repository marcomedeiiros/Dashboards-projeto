const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); 

const app = express();
const port = 5000;

app.use(cors()); 
app.use(bodyParser.json()); 

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

    console.log('Recebendo dados:', { usuario, senha });

    const checkQuery = 'SELECT * FROM users WHERE usuario = ?';

    db.query(checkQuery, [usuario], (err, results) => {
        if (err) {
            console.log('Erro ao verificar usuário:', err);
            return res.status(500).json({ message: 'Erro ao verificar usuário' });
        }

        if (results.length > 0) {
            res.status(400).json({ message: 'Usuário já existe' });
        } else {
            const insertQuery = 'INSERT INTO users (usuario, senha) VALUES (?, ?)';
            
            db.query(insertQuery, [usuario, senha], (err, results) => {
                if (err) {
                    console.log('Erro ao registrar usuário:', err);
                    return res.status(500).json({ message: 'Erro ao registrar usuário' });
                }
                console.log('Usuário registrado com sucesso!');
                res.status(200).json({ message: 'Usuário registrado com sucesso!' });
            });
        }
    });
});

app.post('/add-venda', (req, res) => {
    const { empresa, data_venda, quantidade } = req.body;

    const query = 'INSERT INTO vendas (empresa, data_venda, quantidade) VALUES (?, ?, ?)';

    db.query(query, [empresa, data_venda, quantidade], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao adicionar venda' });
        }
        res.status(201).json({ message: 'Venda adicionada com sucesso!', vendaId: results.insertId });
    });
});

app.get('/vendas', (req, res) => {
    const query = 'SELECT * FROM vendas';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao recuperar vendas' });
        }
        res.status(200).json(results);
    });
});

app.put('/update-venda/:id', (req, res) => {
    const { id } = req.params;
    const { empresa, data_venda, quantidade } = req.body;

    const query = 'UPDATE vendas SET empresa = ?, data_venda = ?, quantidade = ? WHERE id = ?';

    db.query(query, [empresa, data_venda, quantidade, id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao atualizar venda' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Venda não encontrada' });
        }

        res.status(200).json({ message: 'Venda atualizada com sucesso!' });
    });
});

app.delete('/delete-venda/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM vendas WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao deletar venda' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Venda não encontrada' });
        }

        res.status(200).json({ message: 'Venda deletada com sucesso!' });
    });
});

// run server
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
