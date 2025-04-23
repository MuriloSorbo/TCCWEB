const express = require('express');
const dbConnection = require('../Database/connection')

const Router = express.Router();

Router.get('/machineStatus', async (req, res) => 
{
    const machineCode = req.session.machineCode;

    try
        {
            const connection = await dbConnection.connections[machineCode].connection;
             
            const data = await connection.machineStatus.find();

            res.json(data)
        }
        catch (ex) { console.log(ex);
         res.sendStatus(401); }
});

Router.get('/operationslist', async (req, res) => 
{
    const machineCode = req.session.machineCode;

    try
        {
            const data = await dbConnection.connections[machineCode].connection.operationsList.find();

            res.json(data);
        } catch{ res.sendStatus(401); }
});

Router.get('/operationsLog/:opName', async (req, res) => 
{
    const machineCode = req.session.machineCode;

    const data = 

    res.json(data);
});

module.exports = Router;