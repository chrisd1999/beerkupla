const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });
require('./config/passport')(passport);

connectDB();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars helpers

const {
  formatDate,
  truncate,
  editIcon,
  select,
  pdfExists,
  beersmithExists,
  filesExist,
  isAuthor,
} = require('./helpers/hbs');
// Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      truncate,
      editIcon,
      select,
      pdfExists,
      beersmithExists,
      filesExist,
      isAuthor,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

// Sessions
app.use(
  session({
    secret: 'kuplakristers',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global user variable

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.isAuthenticated = req.isAuthenticated() || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/recipes', require('./routes/recipes'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
