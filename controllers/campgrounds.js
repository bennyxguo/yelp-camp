const md5 = require('md5')
const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}

module.exports.create = (req, res) => {
  res.render('campgrounds/new')
}

module.exports.store = async (req, res) => {
  const campground = new Campground(req.body.campground)
  campground.author = req.user._id
  await campground.save()
  req.flash('success', 'Successfully made a new campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.show = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author')
  if (!campground) {
    req.flash('error', 'Cannot find that campground')
    return res.redirect('/campgrounds')
  }
  if (campground.reviews.length) {
    campground.reviews = campground.reviews.map((review) => {
      review.author.hash = md5(review.author.email.trim())
      return review
    })
  }

  // console.log(campground.reviews[0])
  res.render('campgrounds/show', { campground })
}

module.exports.edit = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  if (!campground) {
    req.flash('error', 'Cannot find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground })
}

module.exports.update = async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(
    id,
    {
      ...req.body.campground
    },
    { new: true }
  )
  req.flash('success', 'Successfully updated a new campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.destroy = async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Successfully deleted a campground!')
  res.redirect('/campgrounds')
}
