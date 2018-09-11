const express = require('express');
const router = express.Router();
const knex = require('../db/knex.js');



//login

router.get('/:id', (req, res)=>{

    const id = req.params.id;
      console.log(id)
    knex('users')
        .where('id', id)
        .first()
        .then((user) => {
          if(user!=undefined) {
            console.log(user)
            //res.redirect(/usuarios);
            res.json({user:user})
            //res.render(login/sesion, {user:user})
          }else {
            //res.redirect("/login");
          }
        });
  
  });
  
  //funcion para redireccionar al formulario de logeo

  
  
  
  
  //logout
  router.get('/cerrar', (req, res) => {  
      console.log("dsfn");
    res.render('user/logout');
  });
  
  

router.get('/', (req, res) => {
    res.render('login');
});


router.post('/', (req, res) => {  
    const usuario=req.body.username;
    const password=req.body.password;
      console.log("prueba",usuario); 
     knex('users')
     .where({ usuario: usuario })
     .select('clave')
     .select('id')  
     .then(function(result) {
       if (!result || !result[0])  {  // not found!
         console.log("Invalido user"); 
         return;
       }
       var pass = result[0].clave;
       if (password === pass) {
           var user= result[0].id;
           console.log("usuario", user);
           
         res.render('localstorage', {user: user});
       } else {
         console.log("authenticado"); 
       }
     })
     .catch(function(error) {
       console.log(error);
   });
   });
   

/*
router.post('/', (req, res) => {

    const usuario  = {
        usuario: req.body.username,
        clave: req.body.password,
        id_rols: 2
    }

    console.log(usuario);

    knex('users')
      .where(usuario).first().select('clave')
      .select('id') .then((user) => {
        
          if(user!=undefined){
            var consul= user[0].id;
            res.redirect('options', {user: consul});
          } else {
              res.redirect('login')
          }
        
      });



});*/

module.exports = router;
