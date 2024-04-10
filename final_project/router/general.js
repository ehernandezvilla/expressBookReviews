const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "User successfully registered"});
    } else {
      return res.status(400).json({message: "Username already exists"});
    }
  }
  return res.status(404).json({message: "Error registering user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN 
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorQuery = req.params.author.toLowerCase();
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase().includes(authorQuery));
  
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for the given author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleQuery = req.params.title.toLowerCase();
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(titleQuery));

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found for the given title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbnQuery = req.params.isbn;
  const reviewsByIsbn = Object.values(books).find(book => book.isbn === isbnQuery);

  if (reviewsByIsbn) {
    return res.status(200).json(reviewsByIsbn.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for the given book" });
  }
});

module.exports.general = public_users;
