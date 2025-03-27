const express = require('express');
const path = require('path');
const dbConnection = require('../Database/connection')

const Router = express.Router();

Router.get('/', (req, res) => 
{
    const code = req.session.code;

    if      (code == 'admin1234') res.redirect('/adm');
    else if (dbConnection.connections[code]) res.redirect('/main');

    else res.sendFile(path.join(__dirname, '../Pages/LoginPage/index.html'));
});

Router.post('/', (req, res) => 
{
    const accessCode = req.body.accessCode;

    if (!accessCode)  
    {
        res.status(401).send();
        return;
    }

    req.session.code = accessCode;
    res.redirect('/login');
});

module.exports = Router;