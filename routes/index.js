var express = require('express');
var router = express.Router();
var Produk = require('../models/produk');
var Cart = require('../models/cart');
var Order = require('../models/order');

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

router.get('/reduce/:id', function(req, res, next){
  var produkID = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(produkID);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next){
  var produkID = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(produkID);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req,res, next){
  if (!req.session.cart){
    return res.render('shop/shopping-cart',{produks:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{produks: cart.generateArray(), totalPrice: cart.totalPrice});
})

router.get('/checkout', isLoggedIn, function(req,res,next){
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout',{total: cart.totalPrice, err: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req,res, next){
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
    var order = new Order({
      user: req.user,
      cart:cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result){
      req.flash('success', 'Success Buy');
      req.cart = null;
      res.redirect('/');
    });
  });
})

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}