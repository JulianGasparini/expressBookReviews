const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message:"User registered succesfully. Now you can login!"});
    } else {
      return res.status(400).json({message: "User already exist!"});
    }
  } else {
    return res.status(400).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const response = await axios.get('');
    res.send(JSON.stringify(response.data,null,4));
  } catch (error) {
    console.error('Error fetching books', error);
    res.status(500).send("Failed to fetch books");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      res.send(response.data); 
    } catch (error) {
      // Handles error during axios request
      if (error.response && error.response.status === 404) {
        res.status(404).json({message: "book with ISBN: "+(isbn)+" does not exist!"});
      } else {  
        console.error('Error fetching books', error);
        res.status(500).send('Failed to fetch book.');
      }
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`); 
    res.send(response.data);  
  } catch (error) {
    if (error.response && error.response.status === 404) {
    res.status(404).json({message: "We have no books from author: "+(author)+"."});
    } else {
    console.error('Error fetching author books', error);
    res.status(500).message("Failed to fetch author books");
    }
  }  
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`); 
    res.send(response.data);  
  } catch (error) {
    if (error.response && error.response.status === 404) {
    res.status(404).json({message: "We have no books with the title: "+(title)+"."});
    } else {
    console.error('Error fetching book', error);
    res.status(500).message("Failed to fetch book");
    }
  }  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn)) {
    res.send(books[req.params.isbn].reviews);
  } else {
    res.status(404).json({message: "book with ISBN: "+(isbn)+" does not exist!"});
  }  
 });

module.exports.general = public_users;
