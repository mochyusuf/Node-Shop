var produk = require('../models/produk');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping');
var products = [
    new produk({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Total_War_Warhammer_cover_art.jpg/220px-Total_War_Warhammer_cover_art.jpg',
        title: 'Total Warhammer',
        description: 'Total War',
        price: 50
    }),
    new produk({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Total_War_Warhammer_cover_art.jpg/220px-Total_War_Warhammer_cover_art.jpg',
        title: 'Total Warhammer',
        description: 'Total War',
        price: 50
    }),
    new produk({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Total_War_Warhammer_cover_art.jpg/220px-Total_War_Warhammer_cover_art.jpg',
        title: 'Total Warhammer',
        description: 'Total War',
        price: 50
    })
];

// console.log(produk);

var done = 0;
for (let i = 0; i < products.length; i++) {
    // console.log(i);
    products[i].save(function(err, result){
        if (err) return console.error(err);
        console.log(i);
        done++;
        
        if (done === products.length) {
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}