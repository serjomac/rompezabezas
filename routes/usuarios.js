const express = require('express');
const router = express.Router();

const knex = require('../db/knex');


var scripts = [{ script: '/js/image.js'}];





/* This router is mounted at /todo */
router.get('/', (req, res) => {
  knex('users')
    .select()
    .then(users => {
      res.render('usuarios/all', { users: users });
    });
});

router.get('/new', (req, res) => {
  res.render('usuarios/new');
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'usuarios/single');
});

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'usuarios/edit');
});

router.post('/', (req, res) => {
  validateTodoRenderError(req, res, (users) => {
    
    knex('users')
      .insert(users, 'id')
      .then(ids => {
        const id = ids[0];
        res.redirect(`/usuarios/${id}`);
      });
  });
});

router.put('/:id', (req, res) => {
  validateTodoRenderError(req, res, (users) => {
    const id = req.params.id;
    knex('users')
      .where('id', id)
      .update(users, 'id')
      .then(() => {
        res.redirect(`/usuarios/${id}`);
      });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if(validId(id)) {
    knex('users')
      .where('id', id)
      .del()
      .then(() => {
        res.redirect('/usuarios');
      });
  } else {
    res.status( 500);
    res.render('error', {
      message:  'Invalid id1'
    });
  }
});

function validateTodoRenderError(req, res, callback) {
    const users = {
      id_rols: req.body.id_rols,
      nombre: req.body.nombre,
      usuario: req.body.usuario,
      clave: req.body.clave,
      puntaje: req.body.puntaje,
      urlimagen: req.body.url
    };
    
    callback(users);
}

function respondAndRenderTodo(id, res, viewName) {
  if(validId(id)) {
    knex('users')
      .select()
      .where('id', id)
      .first()
      .then(users => {
        res.render(viewName, users);
      });
  } else {
    res.status( 500);
    res.render('error', {
      message:  'Invalid id2'
    });
  }
}

function validTodo(users) {
  return typeof users.nombre == 'string' &&
          users.nombre.trim() != '' &&
          typeof users.usuario != 'undefined' &&
          !isNaN(users.usuario);
}

function validId(id) {
  return !isNaN(id);
}

module.exports = router;
