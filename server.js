require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const campaign = require('./models/campaign');
const methodOverride = require('method-override');
const { default: axios } = require('axios');
let API_URL = "https://www.dnd5eapi.co/api/classes/";


const SECRET_SESSION = process.env.SECRET_SESSION;
console.log(SECRET_SESSION);

app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
})

// Add this above /auth controllers
app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('profile', { id, name, email });
});

// controllers
app.use('/auth', require('./controllers/auth'));
app.use('/campaigns', require('./controllers/campaigns'));
app.use('/characters', require('./controllers/characters'));
app.use('/locations', require('./controllers/locations'));
app.use('/lores', require('./controllers/lores'));
app.use('/majorFactions', require('./controllers/majorFactions'));
app.use('/stories', require('./controllers/stories'));
app.use('/villains', require('./controllers/villains'));


axios.get(API_URL) 
.then(function (response) {
  if(response.status === 200) {
    console.log('RESPONSE', response.data.results[0].name);
    let classList = [];
    for(let i = 0; i < response.data.count; i++) {
      classList.push(response.data.results[i].name);
    }
    console.log('CLASS LIST', classList);
    console.log('CLASS LIST LENGTH', classList.length);
  }else{
    console.log('NO RESPONSE');
  }
})
.catch(function (err) {
  console.log("API Error", err);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
