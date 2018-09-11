var express = require('express');
var router = express.Router();
const knex = require('../db/knex.js');





router.get('/', function(req, res){
             
  knex('users')
     .where("id_rols", 1)
     .then( users => {
      res.render('index', {users: users});
  });
  
});

module.exports = router;
