const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    }
    
const authenticatedUser = (username,password)=>{ //returns boolean
    console.log(users);
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
    }
 
//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } 
  else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn]
    console.log(book);
    if (book) { //Check if book exists
        let userName = req.body.username;
        let review = req.body.review;
        //check existence of valid user
        let validusers = users.filter((user)=>{
            return (user.username === userName)
          });

         if(validusers.length > 0) {
            book.reviews[userName] = {
                review: review
            };
            console.log(book);            
        }
        books[isbn]=book;
        res.send(JSON.stringify(book));
    }
    else{
        res.send("Unable to find book!");
    }
  });

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn]
    console.log(book);
    if (book) { //Check if book exists
        const userName = req.body.username;
        //check existence of valid user
        let validusers = users.filter((user)=>{
            return (user.username === userName)
          });

         if(validusers.length > 0) {
            delete book.reviews[userName];
            console.log(`Review of user ${userName} for book isbn ${isbn} has been removed.`);
            console.log(book);            
        }
        books[isbn]=book;
        res.send(JSON.stringify(book));
    }
    else{
        res.send("Unable to find book!");
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
