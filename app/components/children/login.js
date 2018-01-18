var React = require("react");

var helpers = require("../utils/helpers");

var PasswordModal = require("./passwordmodal.js");

var login = React.createClass({

	getInitialState: function() {
	  	return {
	  		email: "",
	  		password: "",
	  	};
	},

  	handleChange: function(event) {
	  	console.log("INPUT CHANGED");
		// Capture any change in the input fields
		var newState = {};
		newState[event.target.id] = event.target.value;
		this.setState(newState);
  	},

	render: function() {
		return (
		<div className="container">
	  	  <div className="row login">
	  		<div className="col s10 offset-s1 col m6 offset-m3">
			  <form action="/login" method="post">
				<div className="row">
					<h2 className="center-align teal-text text-lighten-2">Welcome back!</h2>
						<div className="input-field col s12">
							<input id="email" type="email" name="username" value={this.state.email} onChange={this.handleChange} className="validate" required />
							<label>Email</label>
						</div>
					</div>
					<div className="row">
						<div className="input-field col s12">
							<input id="password" name="password" type="password" value={this.state.password} onChange={this.handleChange} className="validate" />
							<label>Password</label>
						</div>
					</div>
					<br />
					<center>
						<button className="btn red lighten-2" type="submit" name="action">Connect
					    </button>
						  <br />
						  <br />
						<PasswordModal /> | New user: <a className='signUp teal-text text-lighten-2'>Register!</a>
					</center>

			  </form>
		    </div> 
		  </div>
		</div>
		)
	}
});

module.exports=login;
