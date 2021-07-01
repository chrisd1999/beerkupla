const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Recipe = require('../models/Recipe');

// @desc Recipes/Landing page
// @route GET /

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('recipes/index', {
      recipes,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc Login
// @route GET /login

router.get('/login', ensureGuest, (req, res) => {
  res.render('login', { layout: 'login' });
});

// @desc Recipes Add/Remove
// @route GET /manager

router.get('/manager', ensureAuth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id }).lean();
    res.render('manager', {
      name: req.user.firstName,
      recipes,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;
