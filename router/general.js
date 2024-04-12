const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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

// Axios task 10 to 13

// Get all books using axios async await promises - Taks 10 
public_users.get('/axios_books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000')
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching data" });
  }
});

// Get book details based on ISBN using axios async await promises - Task 11 
public_users.get('/axios_books/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching data" });
  }
});

// Get book details based on author using axios async await promises - Task 12
public_users.get('axios_books/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  console.log(author)
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data)
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching data" });
  }
});

// Get book details based on title using axios async await promises - Task 13 
public_users.get('/axios_books/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching data" });
  }
});


module.exports.general = public_users;
