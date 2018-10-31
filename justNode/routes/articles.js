const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();

/** Bring in Article Models */
let Article = require ('../models/article');

/** Add get articles route */
router.get('/add', function(req, res){
    res.render ('add-article', {
      title:'Add article'
    });
  });
  
  /** Add submit form (POST) route with ES6 */
  
  router.post('/add',
   [
    check('title').isLength({min:1}).trim().withMessage('Title required'),
    check('author').isLength({min:1}).trim().withMessage('Author required'),
    check('body').isLength({min:1}).trim().withMessage('Body required')
   ],
    (req,res,next)=>{
  
    let article = new Article({
    title:req.body.title,
    author:req.body.author,
    body:req.body.body
   });
  
   const errors = validationResult(req);
  
   if (!errors.isEmpty()) {
    console.log(errors);
       res.render('add_article',
        { 
         article:article,
         errors: errors.mapped()
        });
     }
     else{
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
  
    article.save(err=>{
     if(err)throw err;
     req.flash('success','New Article added by '+article.author);
     res.redirect('/');
    });
   }
  });
  
  /** Get single Article route */
  router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
  res.render('article',{
    article:article
  });
  });
  });
  
  /** Load Edit article form (GET)*/
  router.get('/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
    res.render('edit-article',{
      title: "Edit Article",
      article:article
    });
    });
    });
  
    /** Save Update form (POST)  */
  
  router.post('/edit/:id',
  [
    check('title').isLength({min:1}).trim().withMessage('Title required'),
    check('author').isLength({min:1}).trim().withMessage('Author required'),
    check('body').isLength({min:1}).trim().withMessage('Body required')
   ], function(req, res, next){
  
    
  let article = {}
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  
  //create a query to access article by id
  let query = {_id:req.params.id}
  
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log(errors);
       res.render('edit-article',
        { 
         article:article,
         errors: errors.mapped()
        });
     }else{
  //Update the data in the database
  Article.update(query, article, function(err){
      req.flash('success', 'Article updated')
      res.redirect('/');
    });
    
     }
  
  });
  
  /**Delete article route */
  router.delete('/:id', function(req, res){
    let query = {_id:req.params.id}
    Article.remove(query, function(err){
  if(err){
    console.log(err);
  }
  res.send('Sucess');
    });
  });

  module.exports = router;