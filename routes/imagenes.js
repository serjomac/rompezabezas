const express = require('express');
const router = express.Router();

const knex = require('../db/knex');

/* This router is mounted at /todo */
router.get('/', (req, res) => {
  knex('images')
    .select()
    .then(images => {
      res.render('imagenes/all', { images: images });
    });
});

router.get('/new', (req, res) => {
  res.render('imagenes/new');
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'imagenes/single');
});

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'imagenes/edit');
});

router.post('/', (req, res) => {
  validateTodoRenderError(req, res, (images) => {
    
    knex('images')
      .insert(images, 'id')
      .then(ids => {
        const id = ids[0];
        res.redirect(`/imagenes/${id}`);
      });
  });
});

router.put('/:id', (req, res) => {
  validateTodoRenderError(req, res, (images) => {
    const id = req.params.id;
    knex('images')
      .where('id', id)
      .update(images, 'id')
      .then(() => {
        res.redirect(`/imagenes/${id}`);
      });
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if(validId(id)) {
    knex('images')
      .where('id', id)
      .del()
      .then(() => {
        res.redirect('/imagenes');
      });
  } else {
    res.status( 500);
    res.render('error', {
      message:  'Invalid id1'
    });
  }
});

function validateTodoRenderError(req, res, callback) {
    const images = {
      descripcion: req.body.descripcion,
      url: req.body.url,
      id_audios: req.body.id_audios
    };
    
    callback(images);
}

function respondAndRenderTodo(id, res, viewName) {
  if(validId(id)) {
    knex('images')
      .select()
      .where('id', id)
      .first()
      .then(images => {
        res.render(viewName, images);
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
