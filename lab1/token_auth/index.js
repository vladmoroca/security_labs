const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const JWT_SECRET = 'haibude';

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'Username1',
    }
]

app.get('/', (req, res) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send('Unauthorized');
            }
            const { username } = decoded;
            return res.json({
                username: username,
                logout: 'http://localhost:3000/logout'
            });
        });
    } else {
        res.sendFile(path.join(__dirname, '/index.html'));
    }
});

app.get('/logout', (req, res) => {
    res.redirect('/');
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find((user) => {
        if (user.login == login && user.password == password) {
            return true;
        }
        return false;
    });

    if (user) {
        const token = jwt.sign({ username: user.username }, JWT_SECRET);
        return res.json({ token: token });
    }

    res.status(401).send('Unauthorized');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
