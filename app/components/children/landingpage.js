
var React = require("react");

var textillate = require("textillate");

var Login = require("./login.js");

var Register = require("./register.js");

var taglines = [
    'I like big books and I cannot lie',
    'I’m all about that book, ’bout that book',
    'What a mighty mighty good book',
    'Every book you take, I’ll be watching you',
    'I’m too sexy for my book',
    'I wanna read with somebody',
    'I just called, to say, I love books',
    'I want to hold your book',
    'I read it through the grapevine',
    'I’ve been waiting for a book like you',
    'Oops! ... I read it again',
    'I kissed a book, and I liked it',
    'My book club brings all the boys to the yard',
    'My books, my books. My books my books my books',
    'Just read it',
];

var selection ="";
var timeoutID;
function loadDelay() {
  timeoutID = window.setTimeout(loadLogin, 1200);
};

function loadLogin() {
  $('.backgroundImage').fadeOut(500);
  $('.tag').hide();
  $('.login').fadeIn(800);
};

$(document).ready(function(){

    $('.register').hide();
    $('.login').hide();

	$(function () {
      $('.tlt').textillate({ 
        loop: false,
          in: { 
                effect: 'fadeInDown',
                shuffle: true
              }
        });
    	
    	$('.tag').textillate({ 
    	  loop: false,
    	  in: { 
    	  		effect: 'fadeInUp',
    		  	shuffle: true
    		  }
        });

        $('.tag').on('inAnimationEnd.tlt', function() {
          console.log("In animation ended");
          loadDelay();
        });
	});

	function pickTagline() {
      selection = taglines[
        Math.floor(Math.random() * taglines.length)
        ];
    console.log("tagline", selection);
    $('.tag').append(selection);
	}
	
	pickTagline();

    $('.signUp').on('click',function(event){

        TweenLite.to(".register", .6, {display: 'block', ease:Back.easeOut}, "+=0");
        TweenLite.from(".register", .6, {opacity: 0, scale:1.5, ease:Back.easeOut}, "+=0");
        $('.login').hide();

    });

    $('.signIn').on('click',function(event){

        TweenLite.to(".login", .6, {display: 'block', ease:Back.easeOut}, "+=0");
        TweenLite.from(".login", .6, {opacity: 0, scale:1.5, ease:Back.easeOut}, "+=0");
        $('.register').hide();
        $('.tlt').show();

    });

});

var landingpage = React.createClass({

  render: function() {

  	return (
	  	<div className="col s12">
	  	 <div className="center-align">
	  	 	<div className='tag'></div>
	  	 	<div className='tlt title'>Book Love</div>
	  	 </div>
	  		<img className="backgroundImage" src="/static/assets/images/books.png" />	

          <Login />	

          <Register />
			
		</div>
		)
	}
});

module.exports = landingpage;	

