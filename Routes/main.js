const express = require('express');
const path = require('path');

const Router = express.Router();

Router.get('/:machineCode', (req, res) => {
    const machineCode = req.params.machineCode;

    req.session.machineCode = machineCode;

    res.sendFile(path.join(__dirname, '../Pages/MainPage/index.html'));
})

module.exports = Router;