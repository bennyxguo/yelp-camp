const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const UserController = require('../controllers/users')

router
  .route('/register')
  .get(UserController.register)
  .post(catchAsync(UserController.store))

router
  .route('/login')
  .get(UserController.login)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login'
    }),
    UserController.signin
  )

router.get('/logout', UserController.logout)

module.exports = router
