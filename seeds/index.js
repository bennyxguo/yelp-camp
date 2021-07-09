const mongoose = require('mongoose')
const Campground = require('../models/campground')
const User = require('../models/user')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected!')
})

const imageSamples = (index) => {
  const images = [
    {
      url: 'https://res.cloudinary.com/dchjbb5qy/image/upload/v1625802845/Yelp-Camp/1200x628_rxicpe.jpg',
      filename: 'Yelp-Camp/1200x628_rxicpe'
    },
    {
      url: 'https://res.cloudinary.com/dchjbb5qy/image/upload/v1625802783/Yelp-Camp/1200x628_rwv4hr.jpg',
      filename: 'Yelp-Camp/1200x628_rwv4hr'
    },
    {
      url: 'https://res.cloudinary.com/dchjbb5qy/image/upload/v1625802767/Yelp-Camp/1200x628_ug8uid.jpg',
      filename: 'Yelp-Camp/1200x628_ug8uid'
    },
    {
      url: 'https://res.cloudinary.com/dchjbb5qy/image/upload/v1625802653/Yelp-Camp/1200x628_mkowdf.jpg',
      filename: 'Yelp-Camp/1200x628_mkowdf'
    },
    {
      url: 'https://res.cloudinary.com/dchjbb5qy/image/upload/v1625802588/Yelp-Camp/1200x628_hnap45.jpg',
      filename: 'Yelp-Camp/1200x628_hnap45'
    },
    {
      url: 'https://res.cloudinary.com/dchjbb5qy/image/upload/v1625802572/Yelp-Camp/1200x628_bh2eoq.jpg',
      filename: 'Yelp-Camp/1200x628_bh2eoq'
    },
    {
      url: 'https://res.cloudinary.com/dchjbb5qy/image/upload/v1625802549/Yelp-Camp/1200x628_rla6sc.jpg',
      filename: 'Yelp-Camp/1200x628_rla6sc'
    },
    {
      url: 'https://res.cloudinary.com/dchjbb5qy/image/upload/v1625802517/Yelp-Camp/1200x628_ujsoyp.jpg',
      filename: 'Yelp-Camp/1200x628_ujsoyp'
    }
  ]
  const selectedImages = []
  selectedImages.push(images[index])
  selectedImages.push(images[index + 1])
  return selectedImages
}

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
  // Find a user for generating Campgrounds
  let user = await User.findOne()

  // If no users exist, create a default user
  if (!user) {
    const email = 'example-user@gmail.com'
    const username = 'admin'
    const password = 'admin'
    user = new User({ email, username })
    const registeredUser = await User.register(user, password)
  }

  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const randomImgIndex = Math.floor(Math.random() * 6)
    const camp = new Campground({
      author: user,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: imageSamples(randomImgIndex),
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur facilis incidunt, officia odit voluptatibus possimus, soluta corrupti nihil eum labore nesciunt, commodi dolor hic molestiae rem rerum dolores maiores ratione!',
      price
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
