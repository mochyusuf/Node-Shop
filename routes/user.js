var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn,function(req,res,next){
  res.render('./user/profile');
})

router.use('/',notisLoggedIn, function(req, res, next){
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup',function(req,res,next){
  var messages = req.flash('error');
  res.render('./user/signup', {csrfToken: req.csrfToken(), messages : messages, hasErrors: messages.length> 0});
})

router.post('/signup', passport.authenticate('local.signup',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/logout', function(req,res,next){
  req.logout();
  res.redirect('/');
});

router.get('/signin', function(req,res,next){
  var messages = req.flash('error');
  res.render('./user/signin',{csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length> 0});
})

router.post('/signin', passport.authenticate('local.signin',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notisLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}