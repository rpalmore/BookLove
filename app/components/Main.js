
var React = require("react");

var Link = require("react-router").Link;

import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'

var Main = React.createClass({

  getInitialState: function() {
    return {
      visible: false,
      };
  },

  toggleVisibility: function() {
      this.setState({
        visible: !this.state.visible
      })
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

            <Menu.Item name='home'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item name='gamepad'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item name='camera'>
              <Icon name='camera' />
              Channels
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