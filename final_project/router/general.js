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
        if(isValid(username)) {
            users.push({username,password})
            return res.send(`${username} successfully registered`)
        }
        else return res.status(409).json({message:`User with username ${username} already exists. try another username `})
    }
  return res.status(400).json({message: "Username and password are required"});
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
  if(!books[isbn]) return res.status(404).json({message:`There is no book for the given ISBN code = ${isbn}`})

  return res.send(books[isbn]);
 });
  
public_users.get('/author/:author',function (req, res) {
  
  let author=req.params.author.toLowerCase()
  const result=[]
  for(let isbn in books){
    if (books[isbn].author.toLowerCase()===author) result.push({isbn,...books[isbn]})
  }
  if(result.length>0) return res.send(result)
  return res.status(404).json({message: `There is no book for the given author ${author}`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title=req.params.title.toLowerCase()
  const result=[]
  for(let isbn in books){
    if (books[isbn].title.toLowerCase()===title) result.push({isbn,...books[isbn]})
  }
  if(result.length>0) return res.send(result)
  return res.status(404).json({message: `There is no book for the given title ${title}`});
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    let isbn=req.params.isbn
    if(books[isbn]) {
        if(Object.entries(books[isbn].reviews).length===0) return res.send("There are no reviews  available now")
        return res.send(books[isbn].reviews)
}
  return res.status(404).json({message:`There is no book for the given ISBN code = ${isbn}`})
});

module.exports.general = public_users;
