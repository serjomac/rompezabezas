const express = require('express');
const router = express.Router();

const knex = require('../db/knex');



/* This router is mounted at /todo */
router.get('/', (req, res) => {
  knex('rols')
    .select()
    .then(rols => {
      res.render('roles/all', { rols: rols });
    });
});

router.get('/new', (req, res) => {
  res.render('roles/new');
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'roles/single');
});

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'roles/edit');
});

router.post('/', (req, res) => {
  validateTodoRenderError(req, res, (rols) => {
    
    knex('rols')
      .insert(rols, 'id')
      .then(ids => {
        const id = ids[0];
        res.redirect(`/roles/${id}`);
      });
  });
});

router.put('/:id', (req, res) => {
  validateTodoRenderError(req, res, (rols) => {
    const id = req.params.id;
    knex('rols')
      .where('id', id)
      .update(rols, 'id')
      .then(() => {
        res.redirect(`/roles/${id}`);
      });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if(validId(id)) {
    knex('rols')
      .where('id', id)
      .del()
      .then(() => {
        res.redirect('/roles');
      });
  } else {
    res.status( 500);
    res.render('error', {
      message:  'Invalid id1'
    });
  }
});

function validateTodoRenderError(req, res, callback) {
    const rols = {
      descripcion: req.body.descripcion
    };
    
    callback(rols);
}

function respondAndRenderTodo(id, res, viewName) {
  if(validId(id)) {
    knex('rols')
      .select()
      .where('id', id)
      .first()
      .then(rols => {
        res.render(viewName, rols);
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
