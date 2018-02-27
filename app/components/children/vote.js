var React = require("react");
var Link = require("react-router").Link;
var {Button, Icon} =  require("semantic-ui-react");
var axios = require("axios");
var helpers = require("../utils/helpers");
var memberIdentification = [];

var vote = React.createClass({

    getInitialState: function() {
        return { 
            shelf: [],
            first_name: "",
            members:[]
        };
    },

    loadServerData: function() {
      $.get("/shelf", function(result) {
        var shelf = result;
        this.setState({ shelf: shelf });
      }.bind(this));

      axios.get("/request").then(function(response) {
        var data = response.data;
        this.setState({ 
          first_name: data.first_name,
        });
      }.bind(this));

      axios.get("/members").then(function(memberList){
        var members = memberList.data;
        this.setState({ members: members });
      }.bind(this));
    },

    componentDidMount: function() {
      this.loadServerData();
    },

    handleChange: function(event, data) {
      helpers.postBookWinner(data.value);
    },

    handleSubmit: function(event) {
      event.preventDefault();
    },

    handleClick: function() {
      alert("Functionality coming!");
      // loadServerData() with new "user"
    },

    render: function() {

      if (this.state.shelf.length === 0) {
        return null
      } else {

      var book = [];
      let x = this.state.shelf.getElementsByTagName("book");
      let z = this.state.shelf.getElementsByTagName("publication_year");
      // TRY: using variable rather than just one tag name
      console.log("Z", z);
      console.log("Z length", z.length);//returns 8
      for (var i = 0; i < z.length; i++) {
        console.log("Z values", z[i].childNodes);
        if (z[i].childNodes.length === 0) {
          console.log("Banana!");//returns one time
        }
      }
        for (var i = 0; i < x.length; i++) {
          if (z[i].childNodes.length != 0) {//this code will remove the book totally
          book.push({
            id: i,
            title: x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue,
            author: x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue,
            avgRating: x[i].getElementsByTagName("average_rating")[0].childNodes[0].nodeValue,
            pubYear: x[i].getElementsByTagName("publication_year")[0].childNodes[0].nodeValue,
            description: x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue,
            image: x[i].getElementsByTagName("image_url")[0].childNodes[0].nodeValue,
            link: x[i].getElementsByTagName("link")[0].childNodes[0].nodeValue,
            pages: x[i].getElementsByTagName("num_pages")[0].childNodes[0].nodeValue,
          });
        } else {
          console.log("More bananas!!");
        }
      }
      
        // } else {
        //   book.push({
        //     pages: "N/A"
        //   })
        // ONLY USE IN ADDITION WITH TOGGLE TO EXPAND TO FULL TEXT, OR LINK TO
        // if (book[i].description.length > 1000) book[i].description = book[i].description.substring(0,1000) + " ... Read More"
      

      var stripHtmlTags = (function(){
        "use strict";

        return function(str){
            if (!str || typeof str === 'undefined' || str === null){
            return false;
        }

        var re = new RegExp('(<([^>]+)>)','ig');
            return str.replace(re," ");;
        };
      })();

      console.log(this.state.members);

      var names = [];
        let y = this.state.members;
        for (var i = 0; i < y.length; i++) {
          names.push(this.state.members[i].first_name);
        };

      // names.pop(this.state.first_name);

      const listItems = names.map((name, id) =>
        <a onClick={this.handleClick} key={id}>{name + " | "}</a>
      );

      console.log(names);

      var titles = book.map((book) => {

        return( 
          <div className="ui unstackable items" key={book.id}>
            <div className="item">
              <div className="image">
                <a href={book.link} target="_blank"> 
                  <img src= {book.image} />
                </a>
                {/*<Button animated='vertical'
                  onSubmit={this.handleSubmit} 
                  value={book.title} 
                  onClick={this.handleChange}>
                    <Button.Content hidden>Select</Button.Content>
                    <Button.Content visible>
                      <Icon name='shop' />
                    </Button.Content>
                </Button>*/}
                <Button className="select"
                  onSubmit={this.handleSubmit} 
                  value={book.title} 
                  onClick={this.handleChange}>
                  Select
                </Button>
              </div>
              <div className="content">
                <a className="header effect" href={book.link} target="_blank"> 
                  {book.title}
                </a>
                <div className="extra">
                  <p>Average rating: {book.avgRating} | {book.author} ({book.pubYear}) | Pages: {book.pages}</p>
                </div>
                <div className="description">
                  <p>{stripHtmlTags(book.description)}</p>
                </div>
              </div>
            </div>
            <div className="ui divider">
            </div>
          </div>

            ) 
        })

        return( 
          <div className="voteLayout">
            <div className="register flow-text">
                <div className="flow-text center-align">
                  Browse a shelf to find your next book.
                  <p>
                    {' There are ' + x.length + ' books on '+ this.state.first_name + '’s shelf. Available shelves: '}{listItems}
                  </p>
                    
                </div>
                <div className="ui divider">
                </div>
              <div className="flow-text renderApiData"> 
                {titles} 
              </div> 
            </div>
          </div>
        )
      }
    }
});
             
module.exports = vote;

