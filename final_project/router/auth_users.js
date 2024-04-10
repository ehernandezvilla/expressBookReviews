const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check if username is already in records.
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
    return res.status(400).json({message: "Error login in"});
  }

  if (authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60 }); // Expires in 1 hour

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({message: "Invalid login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
