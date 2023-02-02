//Name: Taj Randhawa
//github: 116taj

const express = require('express');
const mongoose = require("mongoose");
const pug = require('pug');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const fs = require('fs');

let app = express();
//setting up express
app.use(express.json());
app.use(express.static("public"));
app.set('views', './views');
app.set('images','./images')
app.set('view engine', 'pug');

//sessions
app.use(session(
    { 
      secret: 'top secret key',
      resave: true,
      saveUninitialized: false,
      user: "",
      admin: false,
      products: [],
      amounts: []
    })
);

//files
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000, //approx 10MB
        },
        abortOnLimit: true,
    })
);
//setting up mongoose and connecting to db
const Product = require("./ProductModel");
const User = require("./UserModel");
const Review = require("./ReviewModel");
const Order = require("./OrderModel");

const { ObjectId, ConnectionClosedEvent } = require('mongodb');
mongoose.connect('mongodb://127.0.0.1/shop', {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
	app.listen(3000);
	console.log("Server listening on port 3000");
});

//routers
app.get('/',getHome);
app.get('/products',getProducts);
app.get('/products/:productID', getProductID);

app.get('/users',getUsers);
app.get('/users/:userID',getUserID);

app.get('/login',login);
app.put('/login',checkLogin);
app.post('/login',register);
app.delete('/login',logout);

app.get('/logout',logout);
app.use('/admin',authorize);    
app.get('/admin',admin);
app.post('/products',addProduct);

app.get('/admin/products',getProductModification);
app.post('/review',postReview);
app.get('/admin/products/:category',getProductsByCategory);
app.post('/image/:name',uploadImage);
app.put('/products/:productID',updateProduct);
app.delete('/products/:productID',deleteProduct);
app.put('/cart',addToCart)
app.get('/cart',getCart);
app.delete('/cart',clearCart);
app.post('/order',order);
app.get('/admin/orders',orderHistory);
  

function getHome(req,res,next){
    res.status(200);   
    res.render('home',{user: req.session.user,admin: req.session.admin}); 
}
//loads gallery by getting all products
function getProducts(req,res,next){
    console.log(req.query);
    Product.find({}).lean().exec(function (err,products){ 
      if (err)
        res.status(404).send("Error: initialize the database!"); 
      Product.find().distinct('category',function(error,results){
        res.status(200).render('products',{products: products, categories: results});
        })  
    });
}

//loads specific product and all of its corresponding info
function getProductID(req,res,next){
    let id = req.params.productID;
    let reviews = [];
    Review.find({productID: id}).lean().exec(function(err,results){
        reviews = results;
    });
    Product.findById(id,function (err,results){
        if (err || results == null){
            return res.status(404).send("Error: product not found in database!");
        }
        res.status(200);
        res.format({
            "application/json": () =>{
                res.json(results)
            },
            "text/html": () =>{
                res.render('product',{product: results, reviews: reviews, user: req.session.user}); 
            },
        })
      });
}

//loads users
function getUsers(req,res,next){
    User.find().lean().exec(function (err,results){ 
        if (err)
            res.status(404).send("Error: initialize the database!");
        res.status(200);   
        res.render('users',{users: results});
      });
}

//loads specific user and all of its corresponding info
function getUserID(req,res,next){
    let id = req.params.userID;
    let reviews = [];
    let orders = [];
    Review.find({userID: id}).lean().exec(function(err,results){
        reviews = results;
        Order.find({userID: id}).lean().exec(function(err,results){
            orders = results;
            User.findById(id,function (err,results){
                if (err || results == null){
                    return res.status(404).send("Error: user not found in database!");
                }
                res.render('user',{user: results, reviews: reviews, orders: orders});  
              });   
        });
    });
}
//logs in user
function login(req,res,next){  
  if(req.session.user){
    res.status(300).redirect('/');
    return;
  } else {
    res.status(200);  
    res.render('login');
  }   
}
//checks if login attempt is successful
function checkLogin(req,res,next){
  User.findOne({name: req.body.username, password: req.body.password}).lean().exec(function(err,results){
    if (results != null){
        req.session.user = req.body.username;
        User.findOne({name: req.session.user}).lean().exec(function(err,results){
            req.session.user = results._id;
            req.session.admin = results.isAdmin;
            res.status(200).send(true);
        })
    } else{
        res.status(200).send(false);
    }
  });
}
//registers the user
function register(req,res,next){
    let makeAdmin = false;
    User.count(function (err,results){
        console.log(results);
        if (results == 0)
            makeAdmin = true;
        User.findOne({name: req.body.username}).lean().exec(async function(err,results){
            if (results == null){
                await User.create({name: req.body.username, password: req.body.password, isAdmin: makeAdmin});
                req.session.user = req.body.username;
                User.findOne({name: req.session.user}).lean().exec(function(err,results){
                    req.session.user = results._id;  
                    res.status(200).send(true);
                })
            } else {
                res.status(200).send(false);
            }
        });     
    })
}
//logs out user
function logout(req,res,next){
    req.session.user = null;
    res.status(200).send();
}

//posts review onto db
function postReview(req,res,next){
    let product =  {};
    console.log(req.session);
    Review.findOne({userID: req.session.user, productID: req.body.id}).lean().exec(async function (err,results){
        console.log(results);
        if (results != null){  
            res.status(400).send();
            return;
        } else {
            Product.findById(req.body.id).lean().exec(async function(err,results){
                product = results;
                product.rating[0]++;
                let ratingSum = product.rating[1]*(product.rating[0]-1);  
                product.rating[1] = (ratingSum+Number(req.body.rating))/product.rating[0];
                let ratingArray = [product.rating[0],product.rating[1]];
                Product.findOneAndUpdate({_id: product._id},{rating: ratingArray}).lean().exec(function(err,results){
                });
            });
            User.findById({_id: req.session.user}).lean().exec(async function(err,results){
                let review = req.body;
                review.productID = req.body.id;
                review.user = results.name; 
                review.userID = req.session.user;
                review.product = req.body.name;
                delete req.body.id;
                await Review.create(review);
                res.status(200).send();
            })
        }
    })   
}

function getProductModification(req,res,next){
    Product.find().distinct('category',function(error,results){
        console.log(results);
        res.status(200).render('productform',{categories: results});
    })
}

function getProductsByCategory(req,res,next){
    console.log("req recieved");
    Product.find({category: req.params.category}).lean().exec(function(err,results){
      console.log(results);  
      res.status(200).send(results);  
    })
}
function addProduct(req,res,next){
    let id = mongoose.Types.ObjectId();
    req.body._id = id;
    Product.create(req.body); 
    res.status(200).send();
}

function updateProduct(req,res,next){
    let id = req.params.productID;
    if (req.body.image != null){
        Product.findOneAndUpdate({id: id},{name: req.body.name, price: req.body.price, stock: req.body.stock, description: req.body.description, category: req.body.category, image: req.body.image}).lean().exec(function(err,results){
            console.log(results);
            res.status(200).send();
        });
    }
    else {
        Product.findOneAndUpdate({id: id},{name: req.body.name, price: req.body.price, stock: req.body.stock, description: req.body.description, category: req.body.category}).lean().exec(function(err,results){
            console.log(results);
            res.status(200).send();
        });
    }
}   

function deleteProduct(req,res,next){
    let id = req.params.productID
    Product.findByIdAndDelete(id).lean().exec(function(err,results){
        console.log(results);
        fs.unlink(__dirname+'/public'+results.image, function(err){
            if(err)
                console.log(err);
        });
        res.status(200).send();
    })
}

function uploadImage(req,res,next){
    let img = req.files.image;    
    let extension = ".png"
    if (img.mimetype != "image/png" && img.mimetype != "image/jpeg")
        res.status(400).send();
    else if (img.mimetype == "image/jpg")
        extension = ".jpg";    
    console.log(img);
    console.log(req.files);
    img.name = req.params.name+extension;
    fs.unlink(__dirname+'/public/images/'+img.name, function(err){
        if(err)
            console.log(err);
    });
    img.mv(__dirname+'/public/images/'+img.name,function(err){
        if(err)
            console.log(err);
    });
    console.log(img);
    res.status(200).send(img.name);
}

function admin(req,res,next){
    res.status(200).render('admin')
}

function addToCart(req,res,next){
    if (req.session.products == null){
        req.session.products = [];
        req.session.amounts = [];
    }
    let stock;
    let index = req.session.products.indexOf(req.body.item);
    Product.findById(req.body.item,function(err,results){
        stock = results.stock;
        if (index != -1){
            if (req.session.amounts[index]+req.body.amount <= stock)
                req.session.amounts[index]+=req.body.amount;
            else 
                res.status(400).send();    
        } else{
            if (req.body.amount > stock)
                res.status(400).send();
            else {
                req.session.products.push(req.body.item)
                req.session.amounts.push(req.body.amount);  
            }    
        }
        console.log(req.session.products);
        res.status(200).send();
    })  
}

function getCart(req,res,next){
    if (req.session.products == null){
        req.session.products = [];
        req.session.amounts = [];
    }
    console.log(req.session.products);
    Product.find({_id: {$in: req.session.products}}).lean().exec(function(err,results){
        res.render('cart',{products: results, amounts: req.session.amounts, user: req.session.user});
    });
}

function clearCart(req,res,next){
    req.session.products = [];
    req.session.amounts = [];
    res.status(200).send();
}

async function order(req,res,next){
    console.log(req.session);
    User.findById(req.session.user).lean().exec(async function(err,results){
        Product.find({_id: {$in: req.session.products}}).lean().exec(async function(err,products){
            let order = {userID: req.session.user, user: results.name, amounts: req.session.amounts, products: products, date: new Date(Date.now())}
            await Order.create(order);
            await updateStock(req.session.products, req.session.amounts);
            console.log("true end");
            res.status(200).send();
        });
    });
}
async function updateStock(products, amounts){
    for (let i = 0; i < products.length; i++){
        Product.findOneAndUpdate({_id: products[i]},{$inc: {stock: -1*amounts[i]}}).lean().exec(function(err,results){});
    }
}
//create full orders object with full products
function orderHistory(req,res,next){
    Order.find().lean().exec(function (err,results){
        console.log(results);
        res.render('orders',{orders: results});
    });

}

function logout(req,res,next){
    req.session.user = null;
    req.session.admin = false;
    getHome(req,res,next);
}

function authorize(req,res,next){
    if (!req.session.admin)
        res.render('unauthorized',{user: req.session.user,admin: req.session.admin}); 
    else 
        next();
}