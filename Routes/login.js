const express = require('express');
const path = require('path');
const dbConnection = require('../Database/connection')

const Router = express.Router();

Router.get('/', async (req, res) => 
{
    const code = req.session.code;

    const login = await dbConnection.usersConnection.findOne({accessCode: code})

    if (login == null) res.sendFile(path.join(__dirname, '../Pages/LoginPage/index.html'));
    else res.redirect('/dashboard');
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