const mongoose = require('mongoose')
const Review = require('./review')
const { Schema } = mongoose

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
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
