const express = require('express');
const path = require('path');
const dbConnection = require('../Database/connection')

const Router = express.Router();

Router.get('/:opName', (req, res) => {
    res.sendFile(path.join(__dirname, '../Pages/OperationPage/index.html'));
})

Router.post('/start/all/:opName', async (req, res) => {
    const opName = req.params.opName;
    const code = req.session.code;
            
    const machines = await dbConnection.usersConnection.findOne({accessCode: code})
    
    machines.machineCodes.forEach(async machineCode => {
    const connection = await dbConnection.connections[machineCode].connection;
    
            try
            {
                 await connection.machineStatus.findOneAndUpdate({}, {
                    operationName: opName,
                    inOperation: true
                    }, {upsert: true});
                
                res.status(200).send();
        
            } catch {
             res.status(401).send();}
    });
});

Router.post('/stop/all', async (req, res) => {
    const code = req.session.code;
            
    const machines = await dbConnection.usersConnection.findOne({accessCode: code})
    
    machines.machineCodes.forEach(async machineCode => {
    const connection = await dbConnection.connections[machineCode].connection;
    
            try
            {
                 await connection.machineStatus.findOneAndUpdate({}, {
                    inOperation: false
                    }, {upsert: true});
                
                res.status(200).send();
        
            } catch {
             res.status(401).send();}
    });
});

Router.post('/start/:opName', async (req, res) => {
    const opName = req.params.opName;
    const machineCode = req.session.machineCode;
    
    const connection = await dbConnection.connections[machineCode].connection;
    
            try
            {
                 await connection.machineStatus.findOneAndUpdate({}, {
                    operationName: opName,
                    inOperation: true
                    }, {upsert: true});
                
                res.status(200).send();
        
            } catch {
             res.status(401).send();}
});

Router.post('/stop', async (req, res) => {
    const machineCode = req.session.machineCode;
    
    const connection = await dbConnection.connections[machineCode].connection;
    
            try
            {
                 await connection.machineStatus.findOneAndUpdate({}, {
                    inOperation: false
                    }, {upsert: true});
                
                res.status(200).send();
        
            } catch {
             res.status(401).send();}
});

module.exports = Router;