const mongoose = require('mongoose');
const MachineStatusSchema = require('./Models/machineStatus');
const OperationsLogSchema = require('./Models/operationsLog');
const OperationsListSchema = require('./Models/operationsList');
const DbNameSchema = require('./Models/machineStatus');
const UsersSchema = require('./Models/users');

let dbNameConnection;
let usersConnection;
const connections = {}

function start()
{
  //const connection = mongoose.createConnection('mongodb+srv://node:node1234@sgm.cgvrzlh.mongodb.net/adm?retryWrites=true&w=majority&appName=SGM');
  const connection = mongoose.createConnection('mongodb+srv://IGA:Senai123@cluster0.66s0i.mongodb.net/adm?retryWrites=true&w=majority&appName=Cluster0');
  dbNameConnection = connection.model(
    'DbName',
    DbNameSchema,
    'DbName'
  );

  usersConnection = connection.model(
    'Users',
    UsersSchema,
    'Users'
  )

  console.log('Connection Stabilished');
}

function fillConnections(dbNames)
{
  JSON.parse(dbNames).forEach(db => {
    console.log(db.accessCode);
    
    connections[db.accessCode] = {connection: addConnection(db.accessCode, db.dbName), accessCode: db.accessCode};
  });
}

async function getDbNames()
{
  return await dbNameConnection.find();
}

async function addConnection(dbName, dbReallyName) {
  //const dbUrl = 'mongodb+srv://node:node1234@sgm.cgvrzlh.mongodb.net/adm?retryWrites=true&w=majority&appName=SGM'.replace('adm', dbName);
  const dbUrl = 'mongodb+srv://IGA:Senai123@cluster0.66s0i.mongodb.net/adm?retryWrites=true&w=majority&appName=Cluster0'.replace('adm', dbName);

  const connection = mongoose.createConnection(dbUrl);

  const machineStatusConnection =connection.model(
    'MachineStatus',
    MachineStatusSchema,
    'MachineStatus'
  );

  const operationsLogConnection = connection.model(
    'OperationsLog',
    OperationsLogSchema,
    'OperationsLog'
  );

  const operationsListConnection = connection.model(
    'OperationsList',
    OperationsListSchema,
    'OperationsList'
  );

  // const newStatus = new machineStatusConnection({ machineName: dbReallyName, connected: false, inOperation: false, lstTemp: -1, lstHum: -1, lstHumAir: -1, lstPH: -1, lstElectricalCondictivity: -1, lstGeo: "0" });
  // await newStatus.save();

  const output = { machineStatus: machineStatusConnection, operationsLog: operationsLogConnection, operationsList: operationsListConnection };
  

  setInterval(async () => {
    const machineStatus = await machineStatusConnection.findOne();

    if (machineStatus.connected == false) return;

    const lstDate = new Date(machineStatus.updatedAt)
    const curDate = new Date();

    const diff = (curDate - lstDate) / 1000
    
    if (diff > 45)
    {
      await machineStatusConnection.findOneAndUpdate({}, {
        connected: false,
    }, {upsert: true});
    }

  }, 10000);

  return output;
}

start();
getDbNames().then((dbNames) => fillConnections(JSON.stringify(dbNames)));
module.exports = {addConnection, connections, dbNameConnection, usersConnection};
