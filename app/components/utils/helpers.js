
var axios = require("axios");

var helper = {
  getSaved: function() {
    return axios.get("/api/saved")
  },

  getNewMember: function() {
    return axios.get("/api/new_member")
      .then(function(results) {
        console.log("axios results", results);
        return results;
      });
  },

  postNewMember: function(first_name, last_name, email, password, phone, goodreads_url, favorite_genre, favorite_book) {
    var newPhone = phone.replace(/-/g, "");
    var newMember = { first_name: first_name, last_name: last_name, email: email, password: password, phone: newPhone, goodreads_url: goodreads_url, favorite_genre: favorite_genre, favorite_book: favorite_book};
    return axios.post("/api/new_member", newMember)
      .then(function(response) {
        console.log("print out response", response)
        window.location.href="/login"
      });
  },

  postChapter: function(chapterUpdate, email) {
    var setChapter = { chapter: chapterUpdate};
    return axios.post("/api/chapter", setChapter)
      .then(function(response) {
        console.log("CHAPTER: ", response);
        window.location.href="/discuss"
      });
  },

  postNewComment: function(chapter, email, newcomment, current_book){
    var setComment={chapter: chapter, email: email, comment: newcomment, BookId: current_book};
    return axios.post("/api/comment", setComment).then(function(response){
      console.log("Comment ", response);
      window.location.href="/discuss"
    })
  },

  postSendEmail: function(email) {
    var email = { email: email};
    return axios.post("/api/send_email", email)
    .then(function(response) {
      return response.data.id
        console.log("Password from helper: ", response.data.id)
      });
  },

  postBookWinner: function(book) {
    var bookWinner = { book: book};
    return axios.post("/api/book_winner", bookWinner)
    .then(function(response) {
      var currentbook={id: response.data.id}
      return currentbook;
    }).then(function(data){
      return axios.post("/api/updateCurrentbook",data).then(function(response){
        window.location.href="/profile";
      })
    });
  },  

};

module.exports = helper;
