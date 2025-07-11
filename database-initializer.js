
const mongoose = require("mongoose");
const Product = require("./ProductModel");

const fs = require("fs");
//db initializer, extract artwork
//then generates users based on artwork 
let productArray = [];
fs.readdir('./products', (err, files) => {
	console.log(files);
		if (err)
		  console.log(err);
		else {
			files.forEach(file => {
				let products = require("./products/" + file);
				console.log(products.length);
				products.forEach(product=>{
				let p = new Product(product);
				productArray.push(p);
			});
		});
	}
}); 
//create db
mongoose.connect('mongodb://127.0.0.1/shop', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
	await mongoose.connection.dropDatabase();
	console.log("Dropped database. Starting re-creation.");
	let completedProducts = 0;
	productArray.forEach(product => {
		console.log(product)
		product.save(function(err,result){
			completedProducts++;
			if(err) throw err;
			if (completedProducts >= productArray.length){
				console.log("Completed");
			}

		});
	});
});

