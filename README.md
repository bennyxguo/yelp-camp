<div align="center">
  <a href="https://tridiamond.tech" target="_blank" rel="noopener noreferrer">
    <img width="100" alt="image" src="https://res.cloudinary.com/tridiamond/image/upload/v1625037705/ObsidianestLogo-hex_hecqbw.png" alt="TriDiamond logo">
  </a>
  <br/>
  <h1>⛺️ <b>Yelp Camp</b> ⛺️</h1>
  <strong>A Node.js web application project from the Udemy course - <a href="https://www.udemy.com/course/the-web-developer-bootcamp/">The Web Developer Bootcamp</a> 2021 by Colt Steele.</strong>
</div>

<br>

<p align="center">
  <img src="https://img.shields.io/github/issues/TriDiamond/yelp-camp">
  <img src="https://img.shields.io/github/forks/TriDiamond/yelp-camp">
  <img src="https://img.shields.io/github/stars/TriDiamond/yelp-camp">
  <img src="https://img.shields.io/github/last-commit/TriDiamond/yelp-camp">
  <img src="https://img.shields.io/github/license/TriDiamond/yelp-camp">
</p>

<br>

<div align="center">
**[Preview](https://peaceful-thicket-41081.herokuapp.com/)**
</div>

## Packages Used

- `Express` - Fast, unopinionated, minimalist web framework for Node.js
- `EJS` - HTML template engine
- `es-mate` - EJS boilerplate layout engine
- `method-override` - Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
- `mongoose` - MongoDB framework for Express
- `morgan` - HTTP request logger middleware for Node.js
- `express-session` - Simple session middleware for Express
  - `connect-mongo` - MongoDB session store for Connect and Express written in Typescript.
- `connect-flash` - A special area of the session used for storing messages.
- `dotenv` - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
- `Passport` - Passport is Express-compatible authentication middleware for Node.js.
  - `passport-local` - Passport strategy for authenticating with a username and password.
  - `passport-local-mongoose` - Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.
- `multer` - Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
  - `multer-storage-cloudinary` - A multer storage engine for Cloudinary.
- `express-mongo-sanitize` - Express 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.
- `sanitize-html` - sanitize-html provides a simple HTML sanitizer with a clear API.
- `helmet` - Helmet helps you secure your Express apps by setting various HTTP headers.

## Features

- Campground maps using [MapBox](https://mapbox.com)
- Image hosting using [Cloudinary](https://cloudinary.com/)
