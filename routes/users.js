const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const UserController = require('../controllers/users')

router.get('/register', UserController.register)

router.post('/register', catchAsync(UserController.store))

router.get('/login', UserController.login)

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
  }),
  UserController.signin
)

router.get('/logout', UserController.logout)

module.exports = router
