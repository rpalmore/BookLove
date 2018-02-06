
var React = require("react");


var Link = require("react-router").Link;


import { Image, List, Container, Progress, Button, Header, Icon, Modal } from 'semantic-ui-react';

// Styling our component
// ======================================|
const divStyle = {
  padding: 20,
  backgroundColor: '#80cbc4',
};

var faq = React.createClass({

  render: function() {
    return(
      <div style={divStyle}>
         <p className='nameStyle'>{'About this site'}</p>
         <p className='nameStyle'>{'Coming soon!'}</p>
      </div>
    )
  }
});

module.exports=faq;

