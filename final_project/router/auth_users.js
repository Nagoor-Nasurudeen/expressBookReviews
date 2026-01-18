const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; 
const SECRET_KEY_JWT="MYSECRET"
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let uniqueUser = users.filter((user)=>{
        return user.username===username
    })
    return !(uniqueUser.length>0)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let credentialUser=users.find((user)=>{
        return user.username===username&&user.password===password
    })
    if (credentialUser) return true
    else return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    let username=req.body.username
    let password=req.body.password
    if (username&&password){
        if(authenticatedUser(username,password)){
            let access_token=jwt.sign({password},SECRET_KEY_JWT,{expiresIn:60*60})
            req.session.authorization={access_token,username}
            return res.send(`${username} successfully logged in`)
        }else res.status(401).json({message : "check username and password"})
    }else return res.status(400).json({message:"username and password are required"})
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn =req.params.isbn
  let review=req.body.review
  let username=req.session.authorization.username
  books[isbn].reviews[username]=review

  if(!books[isbn]) return res.status(404).json({message:`There is no book for the given ISBN code = ${isbn}`})

  return res.send(`Review uploaded successfully for the user ${username}`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
