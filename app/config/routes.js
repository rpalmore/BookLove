// Inclue the React library
var React = require("react");

// Include the react-router module
var router = require("react-router");

// Include the Route component
var Route = router.Route;

//  Include the IndexRoute (catch-all route)
var IndexRoute = router.IndexRoute;

// Include the Router component
var Router = router.Router;

// Include the browserHistory prop to configure client side routing
// https://github.com/ReactTraining/react-router/blob/master/docs/guides/Histories.md#browserhistory
var browserHistory = router.browserHistory;

// Reference the high-level components
var Main = require("../components/Main");
var login = require("../components/children/login");
var register = require("../components/children/register");
var vote = require("../components/children/vote");
var landingpage = require("../components/children/landingpage");
var profile = require("../components/children/profile");
var discuss = require("../components/children/discuss");
var chaptermodal = require("../components/children/chaptermodal");
var passwordmodal = require("../components/children/passwordmodal");
var faq = require("../components/children/faq");	

// Export the Routes
module.exports = (
  // High level component is the Router component.
  <Router history={browserHistory}>
   <Route path="/" component={landingpage} />
    <Route path="/index" component={Main}>
		<Route path="/vote" component={vote} />
		<Route path="/profile" component={profile} />
		<Route path="/discuss" component={discuss} />
		<Route path="/faq" component={faq} />
   </Route>
  </Router>
);

