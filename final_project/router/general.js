const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      console.log(users);
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

async function fetchBooksFromDataSource() {
    return books;
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const books = await fetchBooksFromDataSource();
  
      return res.send(JSON.stringify(books));
    } catch (error) {
      console.error(error);
    }
});

//public_users.get('/', function (req, res) {
//  return res.status(200).json(JSON.stringify(books));
//});

// Get book details based on ISBN
async function checkISBN(isbn) {
    return books;
}
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  isbnExists = await checkISBN(isbn);
  if (isbnExists){
    return res.status(200).json(books[isbn])
  }
  else
  {
    return res.status(200).json({message: "The book with this isbn does not exist"})
  }
 });
  
 async function findBookByAuthor(authorName) {
    for (let key in books) {
      if (books[key].author === authorName) {
        return key;
      }
    }
    return null; // Return null if no matching book is found
  }

 // Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toString();
    let foundBook = await findBookByAuthor(author);
    if (foundBook){
        return res.status(200).json(books[foundBook])
    }
    else
    {
        return res.status(200).json({message: "The book with this author does not exist"})
    }
});

async function findBookByTitle(titleName) {
    for (let key in books) {
      if (books[key].title === titleName) {
        return key;
      }
    }
    return null; // Return null if no matching book is found
  }
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toString();
    console.log(title);
    let foundBook = await findBookByTitle(title);
    if (foundBook){
        return res.status(200).json(books[foundBook])
    }
    else
    {
        return res.status(200).json({message: "The book with this title does not exist"})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (isbn in books){
        return res.status(200).json(books[isbn].reviews)
    }
    else
    {
        return res.status(200).json({message: "The book with this isbn does not exist"})
    }
   });

module.exports.general = public_users;
