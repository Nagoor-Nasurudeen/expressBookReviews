const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    let username=req.body.username
    let password=req.body.password
    if (username&&password) {
        if(isValid(username,password)) {
            users.push({username,password})
            return res.send(`${username} successfully registered`)
        }
        else return res.status(409).json({message:`User with username ${username} already exists. try another username `})
    }
  return res.status(400).json({message: "Username and password are requirred"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn
  if(!books[isbn]) return res.status(404).json({message:`There is no book for the given ISBN code ${isbn}`})

  return res.send(books[isbn]);
 });
  
public_users.get('/author/:author',function (req, res) {
  
  let author=req.params.author.toLowerCase()
  const result=[]
  for(let isbn in books){
    if (books[isbn].author.toLowerCase()===author) result.push(books[isbn])
  }
  if(result) return res.send(result)
  return res.status(404).json({message: `There is no book for the given author ${author}`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
