const mongoose = require('mongoose')
const Review = require('./review')
const { Schema } = mongoose

const ImageSchema = new Schema({
  url: String,
  filename: String
})

// Virtual property with mongoose.
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_100')
})

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      require: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
  console.log(doc)
  if (doc) {
    const { reviews } = doc
    await Review.deleteMany({
      _id: {
        $in: reviews
      }
    })
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema)
