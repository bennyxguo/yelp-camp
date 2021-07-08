const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas.js')
const Review = require('../models/review')

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)

  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  }

  next()
}

module.exports.isReivewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params
  const review = await Review.findById(reviewId)
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!')
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}
