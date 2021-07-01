const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const { formatDownload } = require('../helpers/formatDownload');

const Recipe = require('../models/Recipe');
const upload = require('../services/upload');

// @desc Add Recipes
// @route GET /recipes/add

router.get('/add', ensureAuth, (req, res) => {
  res.render('recipes/add');
});

// @desc Process Recipes
// @route POST /recipes

router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    console.log(`Body User: ${req.body.user}, User Id: ${req.user.id}`);
    await Recipe.create(req.body);
    res.redirect('/manager');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc Upload file
// @route POST /recipes/upload/:id

router.post(
  '/upload/:id',
  upload.single('pdfUpload'),
  ensureAuth,
  (req, res, next) => {
    try {
      if (req.fileValidationError) {
        res.render('error/404', {
          error: 'We do not support this file extension.',
        });
      } else {
        res.redirect('/recipes/' + req.params.id);
      }
    } catch (err) {
      console.error(err);
      res.render('error/500');
    }
  }
);

// @desc Show single ecipe
// @route GET /recipes/:id

router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let recipe = await Recipe.findById({ _id: req.params.id })
      .populate('user')
      .lean();
    if (!recipe) {
      return res.render('error/404');
    }
    res.render('recipes/show', { recipe });
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

// @desc Download single recipe
// @route POST /download/:id

router.post('/download/:id', (req, res) => {
  try {
    const extensions = ['.pdf', '.bsmx'];
    if (req.body.pdf === '') {
      const file = path.join(
        __dirname,
        `../download/${req.params.id}/${req.params.id}${extensions[0]}`
      );
      res.download(file);
    } else if (req.body.beersmith === '') {
      const file = path.join(
        __dirname,
        `../download/${req.params.id}/${req.params.id}${extensions[1]}`
      );
      res.download(file);
    } else {
      res.render('error/404', { error: 'Nevarējām lejupielādēt recepti!' });
    }
  } catch (err) {
    console.error(err);
    res.render('error/404', { error: 'Nevarējām lejupielādēt recepti!' });
  }
});

// @desc Show User Recipes
// @route GET /recipes/user/:userId

router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const recipes = await Recipe.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();
    res.render('recipes/index', { recipes });
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

// @desc Edit Recipes
// @route GET /recipes/edit/:id

router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
    }).lean();

    if (!recipe) {
      return res.render('error/404');
    }

    if (recipe.user != req.user.id) {
      res.redirect('/');
    } else {
      res.render('recipes/edit', {
        recipe,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

// @desc Update Recipe
// @route PUT /recipes/:id

router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id).lean();
    if (!recipe) {
      return res.render('error/404');
    }

    if (recipe.user != req.user.id) {
      res.redirect('/');
    } else {
      recipe = await Recipe.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect('/recipes/' + req.params.id);
    }
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc Delete Recipe
// @route DELETE /recipes/:id

router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Recipe.deleteOne({ _id: req.params.id });
    res.redirect('/manager');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;
