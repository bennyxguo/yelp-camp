const md5 = require('md5')
const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}

module.exports.create = (req, res) => {
  res.render('campgrounds/new')
}

module.exports.store = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1
    })
    .send()
  const campground = new Campground(req.body.campground)
  // Storing the geoJSON from MapBox.
  campground.geometry = geoData.body.features[0].geometry
  // Mapping the images data into our data format.
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }))
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
  // Storing the geoJSON from MapBox.
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1
    })
    .send()
  campground.geometry = geoData.body.features[0].geometry
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }))
  campground.images.push(...imgs)
  await campground.save()

  if (req.body.deleteImages) {
    // Remove images from Cloudinary.
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    // Remove images from database.
    console.log(req.body.deleteImages)
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } }
    })
  }

  req.flash('success', 'Successfully updated a new campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.destroy = async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Successfully deleted a campground!')
  res.redirect('/campgrounds')
}
