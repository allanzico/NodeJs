const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log ('connected to database');
})

//Check for DB Errors
db.on('error', function(){
  console.log(err);
})

const hostname = '127.0.0.1';
const port = 3000;

//Initialize app
const app = express();

/** Bring in Models */
let Article = require ('./models/article');

/**Load view engine */
app.set('views', __dirname + '/views');
app.set ('view engine', 'pug');

/** Add a generic JSON and URL-encoded parser as a top-level middleware, 
 * which will parse the bodies of all incoming requests */

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

/** Home route */
app.get('/', function(req, res){
Article.find({}, function(err, articles){
  if(err){
    console.log(err);
  }else{
    res.render ('index', {
      title: 'Articles',
      articles: articles
    });
  }
 
});
});

/** Add get articles route */
app.get('/articles/add', function(req, res){
  res.render ('add-article', {
    title:'Add article'
  });
});

/** Add submit form (POST) route */

app.post('/articles/add', function(req, res){

  //access the model and request for data using the Body parser
let article = new Article();
article.title = req.body.title;
article.author = req.body.author;
article.body = req.body.body;

//Save the data to the database
article.save(function(err){
if(err){
  console.log(err)
  return;
}else{
  res.redirect('/');
}
});

});

/** Get single Article route */
app.get('/article/:id', function(req, res){
Article.findById(req.params.id, function(err, article){
res.render('article',{
  article:article
});
});
});

/** Load Edit article form*/
app.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
  res.render('edit-article',{
    title: "Edit Article",
    article:article
  });
  });
  });

//Start Server
app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
