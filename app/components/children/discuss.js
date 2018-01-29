var React = require("react");
var axios = require("axios");
var Link = require("react-router").Link;
var helpers = require("../utils/helpers");

import { Image, List, Card, Container, Divider, Feed, Progress, Button, Header, Icon, Modal } from 'semantic-ui-react';

const divStyle = {
  paddingTop: 20,
  paddingBottom: 20,
  backgroundColor: '#80cbc4',
};

const text = {
  padding: 0,
};

const commentDiv = {
  marginTop: 15,
  // borderBottomColor: '#ffffff',
  // borderBottomWidth: 1,
  // borderBottomStyle: 'solid',
};

var listComment = [];

var discuss = React.createClass({

	getInitialState: function() {
	  	return {
        photo_path:"",
	  		first_name: "",
	  		last_name: "",
	  		email: "",
	  		current_book:"",
	  		chapter: "",
        newcomment:"",
        comments:[]
	  	};
	},


  componentWillMount() {
    axios.get("/request").then(function(response) {
    // console.log("axios results", response);
    var data = response.data;
    this.setState({ 
      photo_path: data.photo_path,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      goodreads_url: data.goodreads_url,
      chapter: data.chapter,
      current_book: data.current_book
      });
    }.bind(this));

    axios.get("/comment").then(function(response){
      var comments=response.data.map((comment)=>{
              return {comment: comment.comment, book: comment.book, chapter: comment.chapter,sender:comment.sender,image:comment.image}
            });
      this.setState({comments: comments});
  }.bind(this));
  },

  handleChange: function(event) {
    console.log("INPUT CHANGED");
    // Capture any change in the input fields
    var info={};
    info[event.target.id]=event.target.value;
    this.setState(info);
  },

  handleSubmit: function(event) {
    event.preventDefault();
    console.log("CLICKED");
    helpers.postNewComment(this.state.chapter, this.state.email, this.state.newcomment, this.state.current_book)
  },

  handleClick: function() {
    console.log("Clicked!");
    event.preventDefault();
    // TO DO: Click needs to go to that person's profile page.
    // This may require different URL structure ... as /profile will only work for user who is logged in.
  },

	render: function() {
    // console.log("print this" + JSON.stringify(this.state.comments));
    var listComment = this.state.comments.map((comment,i) => {

              return <div style={commentDiv} key={i}><a onClick={this.handleClick}><img src={'/static'+comment.image} className="circle col s2" /></a><p style={text}>{comment.comment}</p> <p>{comment.sender} is talking about: {comment.book} | Chapter: {comment.chapter}</p><Divider clearing={true} /></div>
          });
		return(
  		<div style={divStyle}>
  			{/*<Image src={'/static'+this.state.photo_path} size='small' shape='circular' centered />*/}
        <div className="row">
          <div className="col s6 offset-s3">
            <div>{listComment}</div>
          </div>
        </div>

        <div className="row center-align">
          <form onSubmit={this.handleSubmit} className="commentForm col s4 offset-s4">
            <input type="text" value={this.state.newcomment} id="newcomment" onChange={this.handleChange} placeholder="Your Comment" />
            <button type="submit" className="btn btn-success">Comment</button>
          </form>
        </div>
		  </div>
		)
	}
});
module.exports = discuss;
