
const mongoose = require("mongoose");
const { faker } = require('@faker-js/faker');
const Product = require("./ProductModel");
const User = require("./UserModel");
const fs = require("fs");
//db initializer, init products and users based on faker

let productArray = [];
let userArray = [];
for (i = 0; i < 50; i++){
	let productName = faker.commerce.product();
	let productPrice = faker.number.int({min: 1, max: 99});
	let productStock = faker.number.int({min: 0, max: 500});
	let productDesc = faker.commerce.productDescription();
	let productCat = faker.commerce.department();
	let productImg = "/images/sample"+faker.number.int({min: 1, max: 5})+".png"
	let product = {"name": productName, "price": productPrice, "stock": productStock, "description": productDesc, "category": productCat, image: productImg};
	let p = Product(product);
	productArray.push(p);
}

for (i = 0; i < 10; i++){
	let uName = faker.internet.displayName();
	let uPass = faker.internet.password();
	let uAdmin = (i == 0)? true : false;
	let user = {"name": uName, "password": uPass, "isAdmin": uAdmin}
	let u = User(user)
	userArray.push(u);
}
//create db
mongoose.connect('mongodb://127.0.0.1/shop', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
	await mongoose.connection.dropDatabase();
	console.log("Dropped database. Starting re-creation.");
	let completedProducts = 0;
	let completedUsers = 0;
	userArray.forEach(user => {
		console.log(user)
		user.save(function(err,result){
			completedUsers++;
			if (err) throw err;
			if (completedUsers >= userArray.length && completedProducts >= productArray.length){
				console.log("Completed");
				process.exit();
			}
		});
	});
	await productArray.forEach(product => {
		console.log(product)
		product.save(function(err,result){
			completedProducts++;
			if (err) throw err;
			if (completedUsers >= userArray.length && completedProducts >= productArray.length){
				console.log("Completed");
				process.exit();
			}

		});
	});
});

