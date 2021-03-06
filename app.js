// Under Development Mode
// Add env configs into the process.env variable
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')

const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')

const passport = require('passport')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const LocalStrategy = require('passport-local')
const User = require('./models/user')

const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')

const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/users')

const mongodbUrl = process.env.MONGO_DB || 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(mongodbUrl, {
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
app.use(mongoSanitize()) // Prevent mongo operator injection
app.use(
  helmet({
    contentSecurityPolicy: false
  })
) // Using helmet protection

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net'
]
const styleSrcUrls = [
  'https://kit-free.fontawesome.com/',
  'https://stackpath.bootstrapcdn.com/',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/',
  'https://cdn.jsdelivr.net'
]
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/'
]
const fontSrcUrls = ['https://cdn.jsdelivr.net']
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/dchjbb5qy/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        'https://images.unsplash.com/'
      ],
      fontSrc: ["'self'", ...fontSrcUrls]
    }
  })
)

const secret = process.env.SECRET || 'this_should_be_a_better_secret'
const store = MongoStore.create({
  mongoUrl: mongodbUrl,
  touchAfter: 24 * 3600 // time period in seconds
})

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
  name: '__ycs', // Custom session id.
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store
}
app.use(session(sessionConfig))
app.use(flash())

// Setting up Passport
// `Passport` @see https://www.passportjs.org/docs/downloads/html/
// `passport-local` @see https://www.passportjs.org/packages/passport-local/
// `passport-local-mongoose` @see https://github.com/saintedlama/passport-local-mongoose
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.authUser = req.user ?? null
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// Registering Routers
app.get('/', (req, res) => {
  res.render('home')
})

app.use('/', usersRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

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

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})
