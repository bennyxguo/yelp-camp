const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const CampgroundController = require('../controllers/campgrounds')

const { auth } = require('../middlewares/auths')
const { validateCampground, isAuthor } = require('../middlewares/campgrounds')

router
  .route('/')
  .get(catchAsync(CampgroundController.index))
  .post(auth, validateCampground, catchAsync(CampgroundController.store))

router.get('/new', auth, CampgroundController.create)

router
  .route('/:id')
  .get(catchAsync(CampgroundController.show))
  .put(
    auth,
    isAuthor,
    validateCampground,
    catchAsync(CampgroundController.update)
  )
  .delete(auth, isAuthor, catchAsync(CampgroundController.destroy))

router.get('/:id/edit', auth, isAuthor, catchAsync(CampgroundController.edit))

module.exports = router
