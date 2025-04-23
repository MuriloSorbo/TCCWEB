const express = require('express');
const path = require('path');
const dbConnection = require('../Database/connection')

const Router = express.Router();

Router.get('/', async (req, res) => {
    const code = req.session.code;
        
    const machines = await dbConnection.usersConnection.findOne({accessCode: code})

    res.json(machines);
});

Router.get('/machineName/:machineCode', async (req, res) => {
    const machineCode = req.params.machineCode;
        
    const connection = await dbConnection.connections[machineCode].connection;
    
    const machine = await connection.machineStatus.findOne();

    res.json(machine);
})

module.exports = Router;