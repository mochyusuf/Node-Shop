var express = require('express');
var router = express.Router();
var Produk = require('../models/produk');

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

module.exports = router;
