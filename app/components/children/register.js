
var React = require("react");

var Link = require("react-router").Link;

var helpers = require("../utils/helpers");

var register = React.createClass({

  getInitialState: function() {
  	return {
  		first_name: "",
  		last_name: "",
  		email_confirm: "",
  		password_confirm: "",
  		phone: "",
  		goodreads_url: "",
  		favorite_genre: "",
  		favorite_book: ""
  	};
  },

  handleChange: function(event) {
  	var newState = {};
  	newState[event.target.id] = event.target.value;
  	this.setState(newState);
  },

  handleSubmit: function(event) {
  	event.preventDefault();
  	helpers.postNewMember(this.state.first_name, this.state.last_name, this.state.email_confirm, this.state.password_confirm, this.state.phone, this.state.goodreads_url, this.state.favorite_genre, this.state.favorite_book)
  },

  render: function() {
  	return(
		<div className="register">
			<form onSubmit={this.handleSubmit} className="col s12">
				<div className="container">
					<h3 className="teal-text text-lighten-2">Welcome</h3>
					<div className="row">
						<div className="input-field col s6">
							<input id="first_name" type="text" value={this.state.first_name} onChange={this.handleChange} className="validate" />
								<label>First Name</label>
						</div>
						<div className="input-field col s6">
							<input id="last_name" type="text" value={this.state.last_name} onChange={this.handleChange} className="validate" />
								<label>Last Name</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s6">
							<input id="email" type="email" className="validate" />
								<label>Email</label>
						</div>
						<div className="input-field col s6">
							<input id="email_confirm" type="email" value={this.state.email_confirm} onChange={this.handleChange} className="validate" />
								<label>Email Confirmation</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s6">
							<input id="password" type="password" className="validate" />
								<label>Password</label>
						</div>
						<div className="input-field col s6">
							<input id="password_confirm" type="password" value={this.state.password_confirm} onChange={this.handleChange} className="validate" />
								<label>Password Confirmation</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s6">
							<input id="phone" type="tel" value={this.state.phone} onChange={this.handleChange} className="validate" />
								<label>Phone</label>
						</div>
						<div className="input-field col s6">
							<input id="goodreads_url" type="url" value={this.state.goodreads_url} onChange={this.handleChange} className="validate" />
								<label>Goodreads Link</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s6">
							<input id="favorite_genre" type="text" value={this.state.favorite_genre} onChange={this.handleChange} className="validate" />
								<label>Favorite Genre</label>
						</div>
						<div className="input-field col s6">
							<input id="favorite_book" type="text" value={this.state.favorite_book} onChange={this.handleChange} className="validate" />
								<label>Favorite Book</label>
						</div>
					</div>
					<center>
						<button id="regBtn" className="btn waves-effect red lighten-2" type="submit" name="action">Submit</button>
					</center>
					<center>
						Already registered? <a className='signIn teal-text text-lighten-2'>Log in!</a>
					</center>
				</div>
			</form>
		</div>	
		)
	}
});

module.exports=register;