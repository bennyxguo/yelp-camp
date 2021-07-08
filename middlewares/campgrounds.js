const ExpressError = require('../utils/ExpressError')
const { campgroundSchema } = require('../schemas.js')
const Campground = require('../models/campground')

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)

  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  }

  next()
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!')
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}
