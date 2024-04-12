const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
let userwithsamename = users.filter((user) => {
  return user.username
});
if(userwithsamename.length>0){
  return true;
  } else {
  return false;
  }
}

const authenticatedUser = (username,password)=> { //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
  return (user.username === username && user.password === password)
});
  if (validusers.length>0){
    return true;
} else {
  return false;
  }
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  if (!username || !password){
    return res.status(400).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: username // It might make more sense to include the username in the token data
    }, 'access', {expiresIn: 60 * 60 }); // Expires in 1 hour

    // Here we set the user information in the session
    req.session.user = {username}; // Align this with your auth middleware check
    req.session.authorization = accessToken; // Simplified for clarity

    // Optionally, you can explicitly save the session here, especially if you're encountering session persistence issues
    req.session.save(err => {
      if (err) {
        // handle error, potentially logging it and returning a 500 error to the client
        return res.status(500).json({message: "Failed to save session."});
      }
      // Session save was successful
      return res.status(200).send("User successfully logged in you session id is: " + req.session.id + " and your token is: " + accessToken);
    });
  } else {
    return res.status(401).json({message: "Invalid login. Check username and password"});
  }
});

// Sign-out endpoint
regd_users.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
      if (err) {
          // Handle the error case
          return res.status(500).json({ message: "Could not log out, please try again" });
      } else {
          // Optionally, clear the cookie on the client side
          res.clearCookie('connect.sid'); // This assumes you're using the default session cookie name
          // Respond to the request indicating the user was logged out
          return res.status(200).json({ message: "Logged out successfully" });
      }
  });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; // Extract isbn from URL parameters
  const { rating } = req.body; // Extract rating from request body

  // Validate the rating
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({message: "Invalid rating"});
  }

  // Find the book by its ISBN
  const bookKey = Object.keys(books).find(key => books[key].isbn === isbn);

  if (bookKey) {
    // If the book is found, add the new review
    books[bookKey].reviews.push({
      username: req.session.user.username,
      rating: req.body.rating, 
      review: req.body.review || null
    });
    return res.status(200).json({message: "Review successfully added", book: books[bookKey]});
  } else {
    // If no book matches the provided ISBN
    return res.status(404).json({message: "Book not found"});
  }
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.session.user.username; // Assuming the username is stored in the session

  // Find the book by its ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Filter out the review added by the current user
  const originalReviewCount = book.reviews.length;
  book.reviews = book.reviews.filter(review => review.username !== username);

  if (book.reviews.length === originalReviewCount) {
    // No reviews were removed, indicating no reviews by the user were found
    return res.status(404).json({ message: "No review found for the user" });
  }

  // Successfully removed the review(s)
  res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
