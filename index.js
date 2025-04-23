const express = require('express');
//const ngrok = require('ngrok');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
const dbConnection = require('./Database/connection');
const loginRouter = require('./Routes/login');
const mainRouter = require('./Routes/main');
const admRouter = require('./Routes/adm');
const uploadRouter = require('./Routes/upload');
const downloadRouter = require('./Routes/download');
const startOperationRouter = require('./Routes/startOperation');
const dashboardRouter = require('./Routes/dashboard');
const machinesRouter = require('./Routes/machines');
const operationRouter = require('./Routes/operation');

const app = express();
const port = 1027;

app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: false }));+

app.use('/Pages/LoginPage/public', express.static('Pages/LoginPage/public'));
app.use('/Pages/MainPage/public', express.static('Pages/MainPage/public'));
app.use('/Pages/AdmPage/public', express.static('Pages/AdmPage/public'));
app.use('/Pages/OperationPage/public', express.static('Pages/OperationPage/public'));
app.use('/Pages/StartOperationPage/public', express.static('Pages/StartOperationPage/public'));
app.use('/Pages/DashboardPage/public', express.static('Pages/DashboardPage/public'));
app.use('/assets', express.static('assets'));

async function validationMiddleware(req, res, next) {
    const code = req.session.code;
    
    const login = await dbConnection.usersConnection.findOne({accessCode: code})
    
    if (login != null) next();
    else res.redirect('/login');
}

app.get('/', (_, res) => res.redirect('/login'));
app.use('/login', loginRouter);
app.use('/main', validationMiddleware, mainRouter);
app.use('/startOperation', validationMiddleware, startOperationRouter);
app.use('/adm', validationMiddleware, admRouter);
app.use('/upload', uploadRouter);
app.use('/download', validationMiddleware, downloadRouter);
app.use('/dashboard', validationMiddleware, dashboardRouter);
app.use('/machines', validationMiddleware, machinesRouter);
app.use('/operation', validationMiddleware, operationRouter);

app.listen(port, () => 
{
    console.log('Server is listening');
});





