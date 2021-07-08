const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const CampgroundController = require('../controllers/campgrounds')

const { auth } = require('../middlewares/auths')
const { validateCampground, isAuthor } = require('../middlewares/campgrounds')

router.get('/', catchAsync(CampgroundController.index))

router.get('/new', auth, CampgroundController.create)

router.post(
  '/',
  auth,
  validateCampground,
  catchAsync(CampgroundController.store)
)

router.get('/:id', catchAsync(CampgroundController.show))

router.get('/:id/edit', auth, isAuthor, catchAsync(CampgroundController.edit))

router.put(
  '/:id',
  auth,
  isAuthor,
  validateCampground,
  catchAsync(CampgroundController.update)
)

router.delete('/:id', auth, isAuthor, catchAsync(CampgroundController.destroy))

module.exports = router
