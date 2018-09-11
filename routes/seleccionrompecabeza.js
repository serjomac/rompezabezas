const express = require('express');
const router = express.Router();
const knex = require('../db/knex.js');


router.get('/', function(req, res){
             
    knex('images')
       .then( images => {
        res.render('seleccionrompecabeza', {images: images});
    });

    //knex('users')
    // .where('id', )
    // .then( users => {
    //  res.render('seleccionrompecabeza', {users: users});
    //});
    
  });
  
  router.get('/puntos/:id', function(req, res){

    const id = req.params.id;

    knex('users')
     .where('id', id)
     .first()
     .then( user => {
      res.json({user: user});
    });
    
  });

  router.post('/puntos/:id', function(req, res){

    const id = req.params.id;

    knex('users')
    .increment('puntaje', 1)
     .where('id', id)
     .then( user => {
      res.json({user: user});
    });
    
  });

module.exports = router;