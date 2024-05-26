const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const request = require("request");
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    const token = req.headers.authorization;
    check_token(token)
    .then(valid => {
        if (valid) {
            return res.json({
                username: "user",
                logout: 'http://localhost:3000/logout'
            });
        } else {
            res.sendFile(path.join(__dirname, '/index.html'));
        }
    })
    .catch(err => {
        console.error('Error checking token:', err.message);
    });
});

app.get('/logout', (req, res) => {
    res.redirect('/');
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    request({ method: 'POST',
    url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    form:  {
        grant_type: 'password',
        username: `${login}`,
        password: `${password}`,
        audience: 'https://dev-mpo4a74t24cr54of.us.auth0.com/api/v2/',
        scope: 'offline_access',
        client_id: 'dG9RzB82qEj9lSYCjgsGUWikomA1mmUc',
        client_secret: 'POkuM9El6ORqQXTShZBnC6dmhNifWvEPUDPGE2Zbqfe1waWcqMmXeNgfFo74nwO6' }
    }, 
    function (error, response, body) {
        if (error) {
            res.status(401).send('Unauthorized');
            throw new Error(error)
        };
        console.log(JSON.parse(body))
        token = JSON.parse(body)['access_token']
        if (token) {
            return res.json({ 
                token: token,
                refresh_token: JSON.parse(body)['refresh_token'],
                expires_in: JSON.parse(body)['expires_in']
             });
        } else res.status(401).send('Unauthorized');
    });
});

app.post('/api/refresh_token', (req, res) => {
    const { refresh_token } = req.body;
    console.log("refresh")
    request({ 
        method: 'POST',
        url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
            client_id: 'dG9RzB82qEj9lSYCjgsGUWikomA1mmUc',
            client_secret: 'POkuM9El6ORqQXTShZBnC6dmhNifWvEPUDPGE2Zbqfe1waWcqMmXeNgfFo74nwO6',
            audience: 'https://dev-mpo4a74t24cr54of.us.auth0.com/api/v2/'
        }) 
    }, 
    function (error, response, body) {
        if (error) {
            res.status(401).send('Unauthorized');
            throw new Error(error);
        }
        const token = JSON.parse(body)['access_token'];
        if (token) {
            return res.json({ token: token });
        } else {
            res.status(401).send('Unauthorized');
        }
    });
});

app.post('/api/signup', (req, res) => {
    const { login, password } = req.body;

    request({ 
        method: 'POST',
        url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: '{"client_id":"dG9RzB82qEj9lSYCjgsGUWikomA1mmUc",\
                "client_secret":"POkuM9El6ORqQXTShZBnC6dmhNifWvEPUDPGE2Zbqfe1waWcqMmXeNgfFo74nwO6",\
                "audience":"https://dev-mpo4a74t24cr54of.us.auth0.com/api/v2/",\
                "grant_type":"client_credentials"}' 
        }, 
        function (error, response, body) {
            if (error) throw new Error(error);
            token = JSON.parse(body)['access_token'];
            let f = request({
                method: 'POST',
                url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/api/v2/users',
                headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: `${login}`,
                    password: `${password}`,
                    connection: 'Username-Password-Authentication'
                })
                }, function (error, response, body) {
                    if (error) throw new Error(error);
                    token = JSON.parse(body)['access_token']
                    if(token) return res.json({ token: token });
                });
            if (error) {
                res.status(401).send('Unauthorized');
                throw new Error(error)
            };
            token = JSON.parse(f.body)['access_token']
            if (token) {
                return res.json({ token: token });
            } else res.status(401).send('Unauthorized');
        });
});

const check_token = (token) => {
    return new Promise((resolve, reject) => {
        request({ 
            method: 'GET',
            url: 'https://dev-mpo4a74t24cr54of.us.auth0.com/pem',
        }, 
        (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            const publicKey = body;
            
            try {
                jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
                    if (err) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    });
};

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
