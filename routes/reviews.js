const express = require('express')
// mergeParams = true
// So that the :id params will be merge into the router here
// If not we will not able to access the campground :id
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const Review = require('../models/review')
const Campground = require('../models/campground')

const { reviewSchema } = require('../schemas.js')

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)

  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  }

  next()
}

router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
  })
)

module.exports = router
