const express = require('express');
const dbConnection = require('../Database/connection')

const Router = express.Router();

// Mexer aqui para adicionar leitura dos sensores em RealTime
Router.post('/machineStatus/:code', async (req, res) => 
{
    //console.log('opa');
    const code = req.params.code;

    if (code == undefined || !dbConnection.connections[code]) res.status(401).send();
    else
    {
        const status = req.body;
        const MachineStatus = dbConnection.connections[code].connection.machineStatus;

        try
        {
            await MachineStatus.findOneAndUpdate({}, {
                connected: true,
                operationName: status.operationName,
                lstTemp: status.lstTemp,
                lstElectricalCondictivity: status.lstElectricalCondictivity,
                lstHum: status.lstHum,
                lstGeo: status.lstGeo,
                lstHumAir: status.lstHumAir,
                lstPH: status.lstPH
                }, {upsert: true});

            res.status(200).send();
    
        } catch {res.status(401).send();}
    }
});

Router.post('/machineName', async (req, res) => 
{
    const code = req.session.code;

    if (code == undefined || !dbConnection.connections[code]) res.status(401).send();
    else
    {
        const machineName = req.body.machineName;
        const MachineStatus = dbConnection.connections[code].connection.machineStatus;
        
        await MachineStatus.findOneAndUpdate({}, {
            machineName: machineName
        }, {upsert: true});

        res.status(200).send();
    }
});

// Mexer aqui para adicionr info
Router.post('/operationsLog/:code', async (req, res) => 
    {
        const code = req.params.code;
    
        if (code == undefined || !dbConnection.connections[code]) res.status(401).send();
        else
        {
            try
            {
                const operation = req.body;
                const OperationsLog = dbConnection.connections[code].connection.operationsLog;
                const OperationsList = dbConnection.connections[code].connection.operationsList;
            
            const operationLog = new OperationsLog(
            {
                opName: operation.opName,
                dateTime: operation.dateTime,
                grain: operation.grain,
                temp: operation.temp, 
                tempSolo: OperationsList.tempSolo,
                hum: operation.hum,
                humAir: operation.humAir,
                PH: operation.ph,
                ElectricalConductivity: operation.electricalConductivity,
                geo: operation.geo
            });
            
            operationLog.save()
    
            const operationInList = await OperationsList.find({ opName: operation.opName });
 
            if (operationInList.length == 0)
            {
                const operationList = new OperationsList(
                {
                    opName: operation.opName,
                    dateTime: operation.dateTime,
                });
                operationList.save()
                res.status(200).send();
            }
            }
            catch (ex){ console.log(ex); res.status(401).send();
             }
        }
    });

module.exports = Router;