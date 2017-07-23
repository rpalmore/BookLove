// TEST FILE TO START QUERYING DATA
var express = require("express");
var passport = require('passport');
console.log("Routes loaded!");

var db = require("../models");

module.exports = function(app) {

  app.post('/login',
    passport.authenticate('local', 
        {failureRedirect: '/',
        failureFlash: true}),
    function(req, res) {
        res.redirect("/profile")
    });

  app.get("/request",require('connect-ensure-login').ensureLoggedIn('/login'),function(req,res){
    console.log("print out this infor " + req.user.first_name);
    // var info={
    //   first_name: req.user.first_name,
    //   last_name: req.user.last_name,
    //   email: req.user.email,
    //   current_book: req.user.current_book,
    //   chapter: req.user.chapter,
    //   photo_path:req.user.photo_path
    // };
    res.json(req.user)
  });

  app.get("/api/members", function(req, res) {
    db.Member.findAll({}).then(function(dbMember) {
      res.json(dbMember);
    });
  });

  app.get("/api/members/:email", function(req, res) {
    db.Member.findOne({
        where: {
            email: req.params.email
        },
    }).then(function(result) {
        var book_associate=JSON.parse(JSON.stringify(result)).current_book
        console.log("book id" + book_associate);
        if (book_associate===0){
          res.json(false)
        }else{
          res.json(true)
        }
    });
  });

  // BUT /api/members/book is returning "null" -- not sure why
  app.get("/api/book", function(req, res) {
    db.Book.findAll({
      attributes: ['title']
    }).then(function(dbBook) {
        res.json(dbBook);
    });
  });

  app.get("/api/book/chapters", function(req, res) {
    db.Chapter.findAll({}).then(function(dbMember) {
        res.json(dbMember);
    });
  });

  app.get("/api/book/discussion", function(req, res) {
    db.Discussion.findAll({}).then(function(dbMember) {
        res.json(dbMember);
    });
  });

  app.get("/api/book/discussion/comments", function(req, res) {
    db.Discussion.findAll({
        attributes: ['comment', 'member_name', 'chapter']
    }).then(function(dbMember) {
      res.json(dbMember);
    });
  });

  // BUT api/members/join is returning "null" -- not sure why
  app.get("/api/join", function(req, res) {
    db.MemberBook.findAll({}).then(function(dbMember) {
        res.json(dbMember);
    });
  });

};