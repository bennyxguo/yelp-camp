const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')

const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Mongo is pluged-in, ready to rock and roll!')
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
// Using `path.join` so that no matter where we run this app
// our path to the views directory will be correct.
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.static('public')) // Adding public resources

// Routers
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get('/', (req, res) => {
  res.render('home')
})

// 404 Handler
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

// Error Handler
app.use((err, req, res, next) => {
  const { status = 500 } = err
  if (!err.message) err.message = 'Oops, soemthing went wrong!'
  res.status(status).render('error', { err })
})

app.listen(3000, () => {
  console.log('Serving on port 3000...')
})
