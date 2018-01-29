var React = require("react");

var Link = require("react-router").Link;

var {Rating, Button} =  require("semantic-ui-react");

var helpers = require("../utils/helpers");

var vote = React.createClass({

    getInitialState: function() {
        return { 
            shelf: [],
            clickedBook: ''
        };
    },

    loadServerData: function() {
        $.get("/shelf", function(result) {
        var shelf = result;
        this.setState({ shelf: shelf });
        }.bind(this))
    },

    componentDidMount: function() {
        this.loadServerData();
    },

    handleChange: function(event, data) {
    // console.log("VALUE ================", data.value[0]);
    helpers.postBookWinner(data.value[0]);
    },

    handleSubmit: function(event) {
    event.preventDefault();
    // console.log("CLICKED Winner");
    },

    render: function() {

      if (this.state.shelf.length === 0) {
        return null
      } else {

      var book = [];
      let x = this.state.shelf.getElementsByTagName("book");
        for (var i = 0; i < x.length; i++) {
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
      }

      var strip_html_tags = (function(){
        "use strict";

        return function(str){
            if (!str || typeof str === 'undefined' || str === null){
            return false;
        }

        var re = new RegExp('(<([^>]+)>)','ig');
            return str.replace(re," ");;
        };
      })();

console.log(strip_html_tags(book[1].description)); // "PHP Exercises"

      var titles = book.map((book) => {

        return( 
          <div className="ui unstackable items" key={book.id}>
            <div className="item">
              <div className="image">
                <a href={book.link} target="_blank"> 
                  <img src= {book.image} />
                </a>
                <div className="hearts">
                  <Rating icon='heart' defaultRating={0} maxRating={5} />
                </div>
                <Button type="button" className="ui basic button"
                  onSubmit={this.handleSubmit} 
                  value={book.title} 
                  onClick={this.handleChange}>
                  <i className="empty heart icon"></i>Winner
                </Button>
              </div>
              <div className="content">
                <a className="header" href={book.link} target="_blank"> 
                  {book.title}
                </a>
                <div className="extra">
                  <p>Average rating: {book.avgRating}</p>
                </div>
                <div className="meta">
                  <div className="author"> 
                    {book.author} ({book.pubYear}) Pages: {book.pages}
                  </div>
                </div>
                <div className="description">
                  <p>{strip_html_tags(book.description)}</p>
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
                  Please rank each book between one and five hearts. Love wins.
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

