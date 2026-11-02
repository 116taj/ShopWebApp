# ShopWebApp

A mock online store, built with Node.js, Express, MongoDB, and Pug templates.
Personal project, last worked on in July 2025.

It covers the parts of a storefront a shopper actually touches. You can browse
the product catalogue or filter it by category, open a product page to read its
description and reviews, leave a rating of your own, register an account and log
in, add items to a cart, and place an order. Past orders stay on your account.

There is also an admin side. An account flagged as an administrator gets a
separate area for adding products, editing or removing existing ones, uploading
a product image, and looking through every order placed in the shop. Anyone else
who tries to open it is turned away.

Nothing here is a real shop. There is no payment step, and the stock is sample
data on either branch.

## Running

Requires Node.js and a MongoDB server running locally. The app connects to
`mongodb://127.0.0.1/shop`.

```sh
npm install
node database-initializer.js   # drops the shop database and refills it
npm start                      # serves on http://localhost:3000
```

The initializer wipes the database before refilling it, so it is a reset rather
than a top-up. What it puts in depends on which branch you are on.

## Branches

The two branches differ in one thing: where the shop gets its stock.

**main** builds the catalogue from `products/products.json`, a short
hand-written list of real items, a banana, an apple, a Coca-Cola, a pencil and a
towel, each with its own photograph, price, stock count and description. The
initializer reads every JSON file in `products/`, so adding a second file
extends the catalogue without touching any code. It creates no user accounts, so
you register through the site, and reaching the admin area means setting
`isAdmin` on your user in the database by hand.

**experimental** drops the fixed list and generates the shop instead: 50 random
products from faker, priced and stocked at random across five placeholder
images, plus 10 user accounts. The first of those accounts is an administrator,
and the script prints each one as it creates it, which is how you get a password
to log in with. It is the faster way to get a full shop to click around in, at
the cost of a catalogue full of nonsense.

## Repository layout

```
server.js                All routes and request handlers
ProductModel.js          Product: name, price, stock, description, category, image
UserModel.js             User: name, password, administrator flag
ReviewModel.js           Review: linked to a user and a product, with a 1 to 5 rating
OrderModel.js            Order: linked to a user, with products, amounts, and a date
database-initializer.js  Fills the database, differs by branch
products/                The hand-written catalogue, on main only
views/                   Pug templates, one per page
public/                  Client-side scripts and product images
```

## Future work

- Passwords are stored as plain text. Hashing them is the first thing a real
  deployment would need.
- The session secret is written into `server.js` and should come from an
  environment variable instead.
- The cart lives in the session, so it empties when the session ends rather
  than following the account.
- Placing an order skips straight past payment. There is no checkout step.
- The two branches have never been reconciled. Making the data source a flag,
  or two scripts side by side, would let one branch do both jobs.
