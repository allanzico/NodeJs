
//Import all libraries
const express = require('express');
const morgan = require ('morgan');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const hbs = require ('hbs');
const expressHbs = require ('express-handlebars');

const app = express();

//Use all the Middleware
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname:'.hbs'})); //Creating the main layout
app.set('view engine', 'hbs'); //Set up the templating engine
app.use(express.static(__dirname + '/public')); //Serve static files from other folders
app.use(morgan('dev')); //Lock all the requests
app.use(bodyParser.json()); //Read input data from Json
app.use(bodyParser.urlencoded({extended: true})); //Read any unicode data

//Require local file main.js
const mainRoutes = require ('./routes/main');

app.use(mainRoutes);

app.listen(3030,(err)=>{
if(err) console.log(err);
console.log(`Running on port ${3030}`);

});