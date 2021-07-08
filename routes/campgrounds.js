const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')

const { auth } = require('../middlewares/auths')
const { validateCampground, isAuthor } = require('../middlewares/campgrounds')
const md5 = require('md5')

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
  })
)

router.get('/new', auth, (req, res) => {
  res.render('campgrounds/new')
})

router.post(
  '/',
  auth,
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

router.get(
  '/:id',
  catchAsync(async (req, res) => {
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
  })
)

router.get(
  '/:id/edit',
  auth,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
      req.flash('error', 'Cannot find that campground')
      return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
  })
)

router.put(
  '/:id',
  auth,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
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
  })
)

router.delete(
  '/:id',
  auth,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground!')
    res.redirect('/campgrounds')
  })
)

module.exports = router
