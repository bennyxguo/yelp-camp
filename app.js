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
const flash = require('connect-flash')
const passport = require('passport')

const LocalStrategy = require('passport-local')
const User = require('./models/user')

const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')

const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const usersRoutes = require('./routes/users')

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

const sessionConfig = {
  secret: 'this_should_be_a_better_secret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
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

app.listen(3000, () => {
  console.log('Serving on port 3000...')
})
