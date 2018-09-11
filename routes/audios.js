const express = require('express');
const router = express.Router();

const knex = require('../db/knex');



/* This router is mounted at /todo */
router.get('/', (req, res) => {
  knex('audios')
    .select()
    .then(audios => {
      res.render('audios/all', { audios: audios });
    });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'audios/single');
});

router.post('/', (req, res) => {
  validateTodoRenderError(req, res, (audios) => {
    
    knex('audios')
      .insert(audios, 'id')
      .then(ids => {
        const id = ids[0];
        res.redirect(`/audios/${id}`);
      });
  });
});

router.put('/:id', (req, res) => {
  validateTodoRenderError(req, res, (audios) => {
    const id = req.params.id;
    knex('audios')
      .where('id', id)
      .update(audios, 'id')
      .then(() => {
        res.redirect(`/audios/${id}`);
      });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if(validId(id)) {
    knex('audios')
      .where('id', id)
      .del()
      .then(() => {
        res.redirect('/audios');
      });
  } else {
    res.status( 500);
    res.render('error', {
      message:  'Invalid id1'
    });
  }
});

function validateTodoRenderError(req, res, callback) {
    const audios = {
      descripcion: req.body.descripcion,
      url: req.body.url
    };
    callback(audios);
}

function respondAndRenderTodo(id, res, viewName) {
  if(validId(id)) {
    knex('audios')
      .select()
      .where('id', id)
      .first()
      .then(audios => {
        res.render(viewName, audios);
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
