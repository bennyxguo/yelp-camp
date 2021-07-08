const express = require('express')
// mergeParams = true
// So that the :id params will be merge into the router here
// If not we will not able to access the campground :id
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const ReviewController = require('../controllers/reviews')

const { auth } = require('../middlewares/auths')
const { validateReview, isReivewAuthor } = require('../middlewares/reviews')

router.post('/', auth, validateReview, catchAsync(ReviewController.store))

router.delete(
  '/:reviewId',
  auth,
  isReivewAuthor,
  catchAsync(ReviewController.destroy)
)

module.exports = router
