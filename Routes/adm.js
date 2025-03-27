const express = require('express');
const path = require('path');
const dbConnection = require('../Database/connection');

const Router = express.Router();

Router.get('/', (req, res) => {
    const code = req.session.code;

    if (code == undefined || code != 'admin1234') res.redirect('/login');
    else res.sendFile(path.join(__dirname, '../Pages/AdmPage/index.html'));
})

Router.get('/connections', async (req, res) => {
    const code = req.session.code;

    if (code == undefined || code != 'admin1234') res.status(401).send();
    else 
    {
        const dbNames = await dbConnection.dbNameConnection.find();
        res.json(dbNames);
    }
})

module.exports = Router;