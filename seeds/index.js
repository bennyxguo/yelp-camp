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
    const randomSig = Math.floor(Math.random() * 1000)
    const camp = new Campground({
      author: user,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251/356x200?sig=${randomSig}`,
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
