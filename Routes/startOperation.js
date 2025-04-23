const express = require('express');
const path = require('path');
const dbConnection = require('../Database/connection')

const Router = express.Router();

Router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/StartOperation/index.html'));
})



module.exports = Router;