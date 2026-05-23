const express = require('express');
const User = require('../Models/user');
const passport = require('passport');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/signup', userController.renderSignupForm);

router.post('/signup', userController.signup);

router.get('/login', userController.loginForm);

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}) , userController.login);

router.get('/logout', userController.logout);

module.exports = router;