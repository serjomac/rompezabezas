var express = require('express');
var router = express.Router();
const knex = require('../db/knex.js');



router.get('/:id', function(req, res){

    var game = req.params.id;
    

    console.log(game);
    knex('images').where("id", game)
       .then( images => {
        console.log(game);
        res.render('juego', {images: images});
    });
    
  });


module.exports = router;
