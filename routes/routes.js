
var express = require("express");
var passport = require('passport');
var request = require('request');
var bcrypt = require('bcryptjs');
var path = require("path");
var db = require("../models");
var nodemailer = require("nodemailer");
var bcrypt = require('bcryptjs');
var randomstring = require("randomstring");

var db = require("../models");

// DETERMINE CONNECTION
// =============================================================|
if (!process.env.PORT) {
var keys = require("../app/config/keys.js");
} else {
  console.log("Heroku connection");
  var keys = process.env
}

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: keys.user,
        clientId: keys.clientID,
        clientSecret: keys.clientSecret,
        refreshToken: keys.refreshToken,
    }
});

// Useful resource: https://medium.com/@pandeysoni/nodemailer-service-in-node-js-using-smtp-and-xoauth2-7c638a39a37e

module.exports = function(app) {

  app.post("/api/new_member", function(req, res) {
    var hashedPassword;
    var salt = bcrypt.genSaltSync(10);
    hashedPassword = bcrypt.hashSync(req.body.password, salt);
      db.Member.findOne({
        where:{
          email:req.body.email
        }
      }).then(function(data){
          if(data){
            var member_id = data.dataValues.id;
              db.Member.update({
                phone: req.body.phone,
                password: hashedPassword,
                goodreads_url: req.body.goodreads_url,
                favorite_genre: req.body.favorite_genre,
                favorite_book: req.body.favorite_book
              }, {
                where: {
                  id: member_id
                  }
              }).then(function(data) {
                 res.json(data);
          });
        };
      });
  });


  // INITIALIZE PASSPORT STRATEGY
  app.post('/login',
    passport.authenticate('local', 
        {failureRedirect: '/',
        failureFlash: true}),
    function(req, res) {
        db.Member.findOne({
        where: {
            id: req.user.id
        },
    }).then(function(result) {
        var book_associate=JSON.parse(JSON.stringify(result)).current_book
        console.log("book id" + book_associate);
        if (book_associate===0){
          res.redirect("/vote")
        }else{
          res.redirect("/profile")
        }
    });
  });

  // GET DATA OF THE MEMBER WHO IS LOGGED IN
  app.get("/request",
    require('connect-ensure-login').ensureLoggedIn('/login'),
    function(req,res){
      res.json(req.user)
  });

  app.get("/comment",
    require('connect-ensure-login').ensureLoggedIn('/login'),
    function(req,res){
      console.log("current chapter" +req.user.chapter);
      db.Discussion.findAll({
        where:{
          chapter: {
            $lte:req.user.chapter
          }
        },
        order: [['updatedAt', 'DESC']],
        limit:5,
        include:[{model:db.Member},{model:db.Book}],
      }).then(function(data){
        var comments=[];
        data=JSON.parse(JSON.stringify(data));
        console.log(data);
        for(key in data){
          comments.push({
            comment:data[key].comment,
            book:data[key].Book.title,
            chapter:data[key].chapter,
            sender:data[key].Member.first_name,
            image:data[key].Member.photo_path
          })
        }
        res.json(comments);
      })
    });

  app.post("/api/comment",
    require('connect-ensure-login').ensureLoggedIn('/login'),
    function(req,res){
      db.Discussion.create({
        chapter:req.body.chapter,
        comment:req.body.comment,
        email:req.body.email,
        BookId:req.body.BookId
      }).then(function(result){
        res.json(result);
      })
    });

  // CHECK TO SEE IF MEMBER IS READING A BOOK
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


  // REQUEST A PROFILE BY MEMBER ID
  app.get("/profile/:id", 
    require('connect-ensure-login').ensureLoggedIn('/login'),
    function(req, res) {      
      console.log("routehit", req.params.id);
      console.log("LOGGED IN", req.user);
      db.Member.findOne({
        where: {
          id: req.params.id
        },
      }).then(function(member){ 
        var profileObject = {
          favorite_book: member.dataValues.favorite_book,
        }
        console.log("profileObject: ", profileObject);
        console.log(profileObject.favorite_book);
        res.json(member);
    });
  });

  // UPDATE MEMBER'S CHAPTER PROGRESS FROM PROFILE PAGE
  app.post("/api/chapter", function(req, res) {
      require('connect-ensure-login').ensureLoggedIn('/login'),
        function(req,res) {
          console.log("this is" + req.user.email);
          res.json(req.user)
        }
        db.Member.findOne({
            where:{
                email: req.user.email
            }
        }).then(function(data){
            console.log(data);
            if(data){
                var member_id = data.dataValues.id;
                db.Member.findOne({
                    where:{
                        id: member_id
                    }
                }).then(function(data){
                    console.log("CHAPTER going to db: ", req.body.chapter);
                    console.log(data);
                        db.Member.update({
                            chapter: req.body.chapter
                        }, {
                            where: {
                                id: member_id
                            }
                        }).then(function(data) {
                            res.json(data)
                  });
                });
            };
      });
  });

  // SEND MEMBER A NEW RANDOM PASSWORD
  app.post('/api/send_email', function(req, res) {       
    var newPassword = randomstring.generate(8);
    console.log("Random string", newPassword);
    var email = req.body.email;
    console.log("User email", req.body.email);
    var hashedPassword;
    var salt = bcrypt.genSaltSync(10);
    hashedPassword = bcrypt.hashSync(newPassword, salt);
    db.Member.findOne({
      where:{
          email:req.body.email
      }
    }).then(function(data){
      if(data){
        var member_id = data.dataValues.id;
        db.Member.findOne({
          where:{
            id : member_id
          }
        }).then(function(data){
          var member_id = data.dataValues.id;
          db.Member.update({
            password: hashedPassword,
              },{
              where:{
                id: member_id
              }
          }).then(function(data){
            var mailOptions = {
              to: email,
              subject: "Your Book Love Password Request",
              text: "Here is your new Book Love password: " + newPassword,
              html: "<body style='background-color: #e57373; text-align: center; padding-bottom: 15px; padding-top: 15px; font-family: Georgia; font-style: normal; font-size: 1.6rem;'><p style='color: #fffbe4; font-style: italic; font-size: 2.6rem;'>Book Love!</p><p style='color: #fffbe4;'>Here is your new Book Love password: </p><b>" + newPassword + "</b></p><p><a href='https://warm-sea-55516.herokuapp.com/' target='blank' style='color: #00CB88; font-size: 1.3rem; font-style: italic;'>Log in to Book Love</p></body>"
            }
            transporter.sendMail(mailOptions, function(error, response){
              if (error){
                console.log(error);
                res.send("error");
              } else {
                console.log("Message sent to: " + req.body.email);
                var sendObject = {status: "sent", password: newPassword};
                res.send(sendObject);
              }
            });
          })
        })
      } else {
        res.send("invalid user")
      };
    });
  });

  // GET SIGNED IN USER'S TO-READ SHELF USING GOODREADS API
  app.get('/shelf',
    require('connect-ensure-login').ensureLoggedIn('/login'),
    function(req, res, next) {
      let key = keys.grkey;
      let secret = keys.grsecret;

      // EXTRACT GOODREADS USER ID FROM URL
      var grURL = req.user.goodreads_url;
      var pattern = (/(?!\/)\d+(?=\-)/);
      let user = grURL.match(pattern);

    request({
      uri: 'https://www.goodreads.com/review/list/' + user + '.xml?key=' + key + '&v=2&shelf=to-read'
    }).pipe(res);
  });

  // GET ANOTHER USER'S TO-READ SHELF USING GOODREADS API
  app.get('/shelf/:id', function(req, res, next) {
      let key = keys.grkey;
      let secret = keys.grsecret;
      db.Member.findOne({
        where: {
          id: req.params.id
        },
      }).then(function(data) {
        console.log('DATA', data.dataValues.first_name);

        // EXTRACT GOODREADS USER ID FROM URL
        var grURL = data.dataValues.goodreads_url;
        var pattern = (/(?!\/)\d+(?=\-)/);
        let user = grURL.match(pattern);
        console.log(user);

    request({
      uri: 'https://www.goodreads.com/review/list/' + user + '.xml?key=' + key + '&v=2&shelf=to-read'
    }).pipe(res);
   });
  });

  // POST WINNING BOOK TO DATABASE
  // TO DO: PULL PAGES INTO DATABASE (RATHER THAN MANUALLY ADD CHAPTERS)
  app.post("/api/book_winner", function(req, res) {
    var title = req.body.book;
    console.log("TITLE", title)
      db.Member.findAll({
        where: {
          current_book:{
            $ne:0
          }
        }
      }).then(function(data){
        if(data){
          db.Book.create({
          title:title,
          chapters:10
        }).then(function(data){
        res.json(data);
        })
      }else{
        res.json(false);
      }
  });
      

  app.post("/api/updateCurrentbook", function(req,res){
    var id=req.body.id;
    console.log("id is " + id);
    db.Member.update({
      current_book:id
    },{ 
      where:{
      current_book:0
      }
    }).then(function(data){
      res.json(data);
    })
   });
  });

  app.get("/book",
    require('connect-ensure-login').ensureLoggedIn('/login'), 
    function(req,res){
      db.Book.findOne({
        where:{
          id: req.user.current_book
          }
      }).then(function(data){
        res.json(data);
    });
  });  

  // Send whole team a text message when a user finishes book.
  app.get("/phone",
    require('connect-ensure-login').ensureLoggedIn('/login'),
    function(req, res){
    var email = req.user.email;
    var user = req.user.first_name;
      db.Book.findOne({
        attributes: ['title'],
          where: {
            id: req.user.current_book
        }
      }).then(function(data) {
        var book = data.dataValues.title;
        db.Member.update({
          current_book: 0,
          chapter: 0
        }, {
          where: {
            id: req.user.id
          }
        }).then(function(data) {
        db.Member.findAll({
          attributes: ['phone']
        }).then(function(phoneNumbers){
        for (i = 0; i < phoneNumbers.length; i++) {
          var numbers = [phoneNumbers[i].dataValues.phone];
          // Calling Nexmo for SMS
          const Nexmo = require('nexmo');
          const nexmo = new Nexmo({
            apiKey: keys.apiKey,
            apiSecret: keys.apiSecret
          });

          nexmo.message.sendSms(
            12013517019, '1'+ numbers, user +' finished ' + book,
            (err, responseData) => {
              if (err) {
                console.log(err);
              } else {
                console.dir(responseData);
            }
          });
        }
       res.json(data);
      });
     });
    });
  });


  app.get("/members", function(req,res){
      db.Member.findAll({
        attributes: ['id', 'first_name', 'goodreads_url']
       }).then(function(data){
        res.json(data);
      });
    });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

};