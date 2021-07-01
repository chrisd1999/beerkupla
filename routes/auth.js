const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc Auth Google
// @route GET /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc Google auth callback
// @route GET /login

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/manager');
  }
);

// @desc Logout user
// @route GET /auth/logout

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

module.exports = router;
