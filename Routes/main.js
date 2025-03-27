const express = require('express');
const path = require('path');
const dbConnection = require('../Database/connection')

const Router = express.Router();

Router.get('/', (req, res) => {
    const code = req.session.code;

    if (code == undefined || !dbConnection.connections[code]) res.redirect('/login');
    else res.sendFile(path.join(__dirname, '../Pages/MainPage/index.html'));
})

module.exports = Router;