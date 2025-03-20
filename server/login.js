const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;


app.use(bodyParser.json());

const users = [
    {
        usuario: 'usuario1',
        password: 'senha123',
    },
    {
        usuario: 'usuario2',
        password: 'senha456',
    }
];

app.post('/', (req, res) => {
    const { usuario, password } = req.body;

    const user = users.find(user => user.usuario === usuario);

    if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: 'Senha incorreta' });
    }

    res.status(200).json({ message: 'Login bem-sucedido' });
});

app.post('/register', (req, res) => {
    const { usuario, password } = req.body;

    const existingUser = users.find(user => user.usuario === usuario);
    if (existingUser) {
        return res.status(400).json({ message: 'Usuário já existe' });
    }

    users.push({ usuario, password });
    

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
});

// run serverrrrrrrr hehehehehe
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});