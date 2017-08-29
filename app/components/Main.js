
var React = require("react");

var axios = require("axios");

var Link = require("react-router").Link;

import { Sidebar, Segment, Sticky, Button, Menu, Image, Icon } from 'semantic-ui-react'

// Styling our component
// ======================================|
const divStyle = {
  padding: 20,
  backgroundColor: '#4db6ac',
};

// Will need to add back in at some point

//             <Menu.Item name='faq'>
//               FAQ
//             </Menu.Item>

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
       <div className="navbar-fixed">
        <nav>
         <div className="nav-wrapper">
          <Button onClick={this.toggleVisibility}><i className="material-icons">menu</i></Button>
            <a className="brand-logo center white-text">Book Love</a>
          </div>
        </nav>
       </div>

        <Sidebar.Pushable as={Segment}>
          
          <Sidebar as={Menu} animation='overlay' width='thin' visible={visible} icon='labeled' vertical inverted>
           <div style={divStyle}>
           <Image src={'/static'+this.state.photo_path} size='tiny' shape='circular' centered />
            <Menu.Item name='username'>
              {this.state.first_name + " " + this.state.last_name}
            </Menu.Item>
            </div>
            <Menu.Item name='profile'>
              <Link onClick={this.toggleVisibility} to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item name='discuss'>
              <Link onClick={this.toggleVisibility} to="/discuss">Discussion</Link>
            </Menu.Item>
            <Menu.Item name='browse'>
              <Link onClick={this.toggleVisibility} to="/vote">Browse</Link>
            </Menu.Item>
            <Menu.Item name='logout'>
              <a onClick={this.toggleVisibility} href="/logout">Log Out</a>
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment>
              {this.props.children}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>

        <footer className="page-footer">
          <div className="row valign-wrapper">
            <div className="col s6">
              <span className="copyright"><strong>© 2017 Copyright Book Love</strong></span>
            </div>
            <div className="col s6">
              <a className="grey-text text-lighten-4 right" href="https://github.com/rpalmore/BookLove" target="_blank"><Icon name='github' size='large'/></a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
});

module.exports = Main;