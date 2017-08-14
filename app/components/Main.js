
var React = require("react");

var axios = require("axios");

var Link = require("react-router").Link;

import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'

// Styling our component
// ======================================|
const divStyle = {
  padding: 20,
  backgroundColor: '#4db6ac',
};

var Main = React.createClass({

  getInitialState: function() {
    return {
      first_name: "",
      last_name: "",
      photo_path: "",
      visible: false,
      };
  },

  toggleVisibility: function() {
      this.setState({
        visible: !this.state.visible
      })
  },

  componentWillMount() {
    axios.get("/request").then(function(response) {
    console.log("axios results", response);
    var data = response.data;
    this.setState({ 
      first_name: data.first_name,
      last_name: data.last_name,
      photo_path: data.photo_path,
      });
    }.bind(this));
  },

  render: function() {
   const { visible } = this.state
    return (
      <div>
        <nav>
         <div className="nav-wrapper">
          <Button onClick={this.toggleVisibility}><i className="material-icons">menu</i></Button>
            <a href="/" className="brand-logo center hoverable white-text">Book Love</a>
             <ul id="nav-mobile" className="right">
              <li className="tab col s4 hoverable white-text"><Link to="/register">Register</Link></li>
              <li className="tab col s4 hoverable white-text"><Link to="/login">Login</Link></li>
             </ul>
          </div>
        </nav>

        <Sidebar.Pushable as={Segment}>
          
          <Sidebar as={Menu} animation='overlay' width='thin' visible={visible} icon='labeled' vertical inverted>
           <div style={divStyle}>
           <Image src={'/static'+this.state.photo_path} size='tiny' shape='circular' centered />
            <Menu.Item name='username'>
              {this.state.first_name + " " + this.state.last_name}
            </Menu.Item>
            </div>
            <Menu.Item name='profile'>
              <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item name='discuss'>
              <Link to="/discuss">Discussion</Link>
            </Menu.Item>
            <Menu.Item name='browse'>
              <Link to="/vote">Browse</Link>
            </Menu.Item>
            <Menu.Item name='faq'>
              FAQ
            </Menu.Item>
            <Menu.Item name='logout'>
              <a href="/logout">Log Out</a>
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment>
              {this.props.children}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      
      </div>
    );
  }
});

module.exports = Main;