const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let user;

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{
  let validuser = users.filter((user)=>{
    return (user.username === username) && (user.password ===password)
  });
  if(validuser.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  user = username;

  if (!password || !username) {
    return res.send("Unable to login");
  }  
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password,
    }, 'access', { expiresIn: 60*60 });
    req.session.authorization = {
      accessToken, username
    }
  return res.status(200).json({message: "User logged succesfully"});
  } else {
    return res.status(208).json({message: "Invalid login. Check username and password"});
  }  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body.review;
  const isbn = req.params.isbn;

  if (books.hasOwnProperty(isbn)) {
    books[isbn].reviews[user] = review;
    res.status(200).json({
      message: `Review for book ${books[isbn].title} by user ${user} was added succesfully`});
  } else {
    res.status(400).json({message: "Please enter a book to review"});
  }
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books.hasOwnProperty(isbn)) {
    delete books[isbn].reviews[user];
    return res.status(209).json({
      messsage: `Book review of ${books[isbn].title} by ${user} has been removed succesfully`
    });
  } else {
    res.status(400).json({message: "Please enter a valid review"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
