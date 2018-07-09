var express = require('express');
var router = express.Router();
var Produk = require('../models/produk');
var Cart = require('../models/cart');

var base = 'localhost:3000';

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Produk.find(function(err,docs){
    var produkChunks = [];
    var chunkSize = 3;
    for (let i = 0; i < docs.length; i+= chunkSize) {
      produkChunks.push(docs.slice(i, i + chunkSize));
      
    }
    res.render('shop/index', { title: 'Shop' , produks: produkChunks, successMsg: successMsg, noMessages: !successMsg});
  });
});

router.get('/add-to-cart/:id', function(req,res,next){
  var produkID = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {items: {}});

  Produk.findById(produkID, function(err, produk){
    if (err) {
      return res.redirect('/');
    }
    cart.add(produk, produk.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
});

router.get('/shopping-cart', function(req,res, next){
  if (!req.session.cart){
    return res.render('shop/shopping-cart',{produks:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{produks: cart.generateArray(), totalPrice: cart.totalPrice});
})

router.get('/checkout', function(req,res,next){
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout',{total: cart.totalPrice, err: errMsg, noError: !errMsg});
});

router.post('/checkout', function(req,res, next){
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
    "sk_test_RbNH7R4OPI8zZYa4IUqHWqmI"
  );
  
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test"
  }, function(err, charge) {
    // asynchronously called
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    req.flash('success', 'Success Buy');
    req.cart = null;
    res.redirect('/');
  });
})

module.exports = router;
