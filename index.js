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
app.use('/assets', express.static('assets'));

app.get('/', (_, res) => res.redirect('/login'));
app.use('/login', loginRouter);
app.use('/main', mainRouter);
app.use('/adm', admRouter);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);
app.use('/operation', operationRouter);

app.listen(port, () => 
{
    console.log('Server is listening');
    //ngrok.connect(port).then(url => console.log(url));
});





