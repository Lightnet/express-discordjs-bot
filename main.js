var express  = require('express')
  , session  = require('express-session')
  , passport = require('passport')
  , Strategy = require('passport-discord').Strategy
  , app      = express()
  ,path = require('path')
  ,refresh = require('passport-oauth2-refresh');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const DISCORDAPIID = process.env.DISCORDAPIID;
const DISCORDAPISECERT = process.env.DISCORDAPISECERT;
const DISCORDBOTTOKEN = process.env.DISCORDBOTTOKEN;
const DISCORDAPICALLBACK = process.env.DISCORDAPICALLBACK;

app.use(express.static('public'));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//var scopes = ['identify', 'email', /* 'connections', (it is currently broken) */ 'guilds', 'guilds.join'];
//var scopes = ['identify', 'email', /* 'connections', (it is currently broken) */ 'guilds', 'guilds.join'];
var scopes = ['identify', 'guilds'];

passport.use(new Strategy({
    clientID: DISCORDAPIID,
    clientSecret: DISCORDAPISECERT,
    callbackURL: DISCORDAPICALLBACK,
    scope: scopes
}, function(accessToken, refreshToken, profile, done) {
    //profile.refreshToken = refreshToken; // store this for later refreshes
    console.log(refreshToken);

    process.nextTick(function() {
        return done(null, profile);
    });
}));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuth, function(req, res) {
  //res.sendFile(path.join(__dirname + '/index.html'));
  res.render('index');
});

app.get('/login', passport.authenticate('discord', { scope: scopes }), function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//app.get('/', function(req, res) {
    //res.sendFile(path.join(__dirname + '/index.html'));
//});

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
      function(req, res) { 
        res.redirect('/');
        //res.redirect('/info')
        //res.sendFile(path.join(__dirname + '/index.html'));
      } // auth success
);
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/info', checkAuth, function(req, res) {
    //console.log(req.user)
    res.json(req.user);
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    //res.send('not logged in :(');
    res.render('basics');
}

app.listen(3000, function (err) {
    if (err) return console.log(err)
    console.log(`Listening at http://${process.env.PROJECT_DOMAIN}:${PORT}`)
});

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(DISCORDBOTTOKEN);

//<iframe src="https://discordapp.com/widget?id=xxxx&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0"></iframe>