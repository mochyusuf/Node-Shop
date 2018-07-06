var express = require('express');
var router = express.Router();
var Produk = require('../models/produk');
var Cart = require('../models/cart');

var base = 'localhost:3000';

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

module.exports = router;
