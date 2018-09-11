const express = require('express');
const router = express.Router();
const knex = require('../db/knex.js');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', (req, res) => {

    const usuario  = {
        usuario: req.body.username,
        clave: req.body.password,
        id_rols: 2
    }

    console.log(usuario);

    knex('users')
      .where(usuario).first().then((user) => {
          if(user!=undefined){
            res.redirect('options');
          } else {
              res.redirect('login')
          }
        
      });



});

module.exports = router;
