
//Require All

const express = require ('express');
const bodyParser = require ('body-parser');
const morgan = require ('morgan');
const request = require ('request');
const async = require ('async');
const expressHbs = require ('express-handlebars');

//Instantiate the Express application and use all the methods that Express has
const app = express();


//
//' 

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
app.use (morgan('dev'));

//Build a URL with request, respond and a callback
app.route('/')
.get((req, res, next) =>{
res.render('main/home');
})
.post((req, res, next) =>{
    //capture user's email

  request ({
url: 'https://us18.api.mailchimp.com/3.0/lists/9090ede3e6/members',
method: 'POST',
headers: {
    'Authorization': 'randomUser a99cb4507f68705f45857813c6b37a2c-us18',
    'Content-Type': 'application/json'
},
json: {
    'email_address': req.body.email,
    'status': 'subscribed'
}

  }, function(err, response, body){
      if (err){
          console.log(err);
      } else {
          console.log("Successfully sent");
          res.redirect('/');
      }
  });

  
    });

//Run the server by assigning a port
app.listen(3030, (err) => {
if (err){
    console.log (err);
}else{
    console.log ("Running on port 3030");
}
});