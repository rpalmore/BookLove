var React = require("react");
var Link = require("react-router").Link;
var {Button, Icon} =  require("semantic-ui-react");
var axios = require("axios");
var helpers = require("../utils/helpers");
var memberIdentification = [];

var listItems = [];

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
      // if user is already reading a book, add a modal here that asks whether or not they want to override their current selection if they click "select" while reading a book. Or, tell them to update their status first.
    },

    handleClick: function(event) {
      var id = event.id;
      $.get("/shelf/"+id, function(result) {
        this.setState({ first_name: event.name });
        var shelf = result;
        this.setState({ shelf: shelf });
      }.bind(this));
    },

    render: function() {

      if (this.state.shelf.length === 0) {
        return null
        // HOW TO BETTER HANDLE THIS IF NO DATA? RETURN MESSAGE TO USER
      } else {

      var book = [];
      let x = this.state.shelf.getElementsByTagName("book");
      let n = this.state.shelf.getElementsByTagName("num_pages");
      let z = this.state.shelf.getElementsByTagName("publication_year");
      let d = this.state.shelf.getElementsByTagName("description");

      // LOG MISSING DATA FOR 2 TAGS THAT ARE NOT CONSISTENT
      for (var i = 0; i < z.length; i++) {
        if (z[i].childNodes.length === 0) {
          console.log("PUB YEAR missing for: " + x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue);
        } 
      }

      for (var i = 0; i < n.length; i++) {
      if (n[i].childNodes.length === 0) {
          console.log("NUM PAGES missing for: " + x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue);
        }
      }

        // HANDLE MISSING DATA IN PARSE LOOP
        for (var i = 0; i < x.length; i++) {
          if (z[i].childNodes.length && n[i].childNodes.length !=0 && d[i].childNodes.length !=0) {
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
        } else if (z[i].childNodes.length === 0 && n[i].childNodes.length !=0 && d[i].childNodes.length !=0) {
          book.push({
            id: i,
            title: x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue,
            author: x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue,
            avgRating: x[i].getElementsByTagName("average_rating")[0].childNodes[0].nodeValue,
            pubYear: 'N/A',
            description: x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue,
            image: x[i].getElementsByTagName("image_url")[0].childNodes[0].nodeValue,
            link: x[i].getElementsByTagName("link")[0].childNodes[0].nodeValue,
            pages: x[i].getElementsByTagName("num_pages")[0].childNodes[0].nodeValue,
          });
        } else if (n[i].childNodes.length === 0 && z[i].childNodes.length !=0 && d[i].childNodes.length !=0) {
          book.push({
            id: i,
            title: x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue,
            author: x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue,
            avgRating: x[i].getElementsByTagName("average_rating")[0].childNodes[0].nodeValue,
            pubYear: x[i].getElementsByTagName("publication_year")[0].childNodes[0].nodeValue,
            description: x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue,
            image: x[i].getElementsByTagName("image_url")[0].childNodes[0].nodeValue,
            link: x[i].getElementsByTagName("link")[0].childNodes[0].nodeValue,
            pages: 'N/A'
          });
        } else if (n[i].childNodes.length === 0 && z[i].childNodes.length === 0 && d[i].childNodes.length !=0) {
          book.push({
            id: i,
            title: x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue,
            author: x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue,
            avgRating: x[i].getElementsByTagName("average_rating")[0].childNodes[0].nodeValue,
            pubYear: 'N/A',
            description: x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue,
            image: x[i].getElementsByTagName("image_url")[0].childNodes[0].nodeValue,
            link: x[i].getElementsByTagName("link")[0].childNodes[0].nodeValue,
            pages: 'N/A'
          });
        } else if (d[i].childNodes.length === 0 && z[i].childNodes.length === 0 && n[i].childNodes.length === 0) {
          book.push({
            id: i,
            title: x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue,
            author: x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue,
            avgRating: x[i].getElementsByTagName("average_rating")[0].childNodes[0].nodeValue,
            pubYear: 'N/A',
            description: 'N/A',
            image: x[i].getElementsByTagName("image_url")[0].childNodes[0].nodeValue,
            link: x[i].getElementsByTagName("link")[0].childNodes[0].nodeValue,
            pages: 'N/A'
          });
        }
      }
      
        // ONLY USE IN ADDITION WITH TOGGLE TO EXPAND TO FULL TEXT, OR LINK TO
        // if (book[i].description.length > 1000) book[i].description = book[i].description.substring(0,1000) + " ... Read More"
      
      // STRIP HTML TAGS FROM XML DATA
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

      var names = [];
        let y = this.state.members;
        for (var i = 0; i < y.length; i++) {
          names.push({name: this.state.members[i].first_name, id: this.state.members[i].id});
        };

      listItems = names.map((name, id) =>
        <a onClick={this.handleClick.bind(this, name)} key={id}>{name.name + " | "}</a>
      );

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

