const express = require('express');
const dbConnection = require('../Database/connection')

const Router = express.Router();

Router.get('/machineStatus', async (req, res) => 
{
    const code = req.session.code;

    if (code == undefined || !dbConnection.connections[code]) res.status(401).send();
    else
    {
        try
        {
            const data = await dbConnection.connections[code].connection.machineStatus.find();

            res.json(data).send();
        }
        catch{ res.status(401).send(); }
    }
});

Router.get('/operationslist', async (req, res) => 
{
    const code = req.session.code;

    if (code == undefined || !dbConnection.connections[code]) res.status(401).send();
    else
    {
        try
        {
            const data = await dbConnection.connections[code].connection.operationsList.find();

            res.json(data).send();
        } catch{}
    }
});

Router.get('/operationsLog/:opName', async (req, res) => 
{
    const code = req.session.code;
    const opName = req.params.opName;

    if (code == undefined || !dbConnection.connections[code]) res.status(401).send();
    else
    {
        const data = await dbConnection.connections[code].connection.operationsLog.find({opName: opName});

        res.json(data);
    }
});

module.exports = Router;