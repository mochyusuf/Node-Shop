var express = require('express');
var router = express.Router();
var Produk = require('../models/produk');
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Produk.find(function(err,docs){
    var produkChunks = [];
    var chunkSize = 3;
    for (let i = 0; i < docs.length; i+= chunkSize) {
      produkChunks.push(docs.slice(i, i + chunkSize));
      
    }
    res.render('shop/index', { title: 'Shop' , produks: produkChunks});
  });
});

router.get('/user/signup',function(req,res,next){
  var messages = req.flash('error');
  res.render('./user/signup', {csrfToken: req.csrfToken(), messages : messages, hasErrors: messages.length> 0});
})

router.post('/user/signup', passport.authenticate('local.signup',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/user/profile', function(req,res,next){
  res.render('./user/profile');
})

module.exports = router;
