# ShopWebApp

A mock online store. Node.js, Express, MongoDB and Pug. Last worked on in July
2025.

Browse the catalogue or filter it by category, open a product to read its
reviews, leave a rating, register, log in, fill a cart and place an order. Your
orders stay on your account.

Admin accounts get their own area: add a product, edit or delete an existing
one, upload a product image, and read through every order in the shop. Everyone
else gets turned away.

There is no payment step, and the stock is sample data on both branches.

## Running

Needs Node.js and a MongoDB server running locally. The app connects to
`mongodb://127.0.0.1/shop`.

```sh
npm install
node database-initializer.js
npm start
```

Then open http://localhost:3000. The initializer drops the shop database before
it refills it.

## Branches

The branches differ in where the stock comes from.

**main** reads `products/products.json`: a banana, an apple, a Coca-Cola, a
pencil and a towel, each with a photo, price, stock count and description. The
initializer loads every JSON file in `products/`, so a second file extends the
catalogue without a code change. It creates no users. Register through the site,
then set `isAdmin` on your user in the database to reach the admin area.

**experimental** generates the shop instead: 50 random products from faker
across five placeholder images, and 10 users. The first user is an admin. Every
account is printed as it is created, passwords included, so you can log in.
Quicker to set up, and the catalogue is nonsense.

## Repository layout

```
server.js                Routes and request handlers
ProductModel.js          Product: name, price, stock, description, category, image
UserModel.js             User: name, password, admin flag
ReviewModel.js           Review: a user, a product, a 1 to 5 rating
OrderModel.js            Order: a user, products, amounts, a date
database-initializer.js  Fills the database, differs by branch
products/                The hand-written catalogue, main only
views/                   Pug templates, one per page
public/                  Client-side scripts and product images
```

## Future work

- Passwords are stored as plain text.
- The session secret sits in `server.js`. It belongs in an environment variable.
- The cart is kept in the session, so it empties with the session instead of
  following the account.
- There is no checkout. Placing an order skips payment entirely.
- The branches have never been reconciled. A flag, or two scripts side by side,
  would let one branch do both.
