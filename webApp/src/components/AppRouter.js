import React from "react";
import Login from "../routes/Auth/Login";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Navigation from "./Navigation/Navigation";
import Home from "../routes/Home/Home";
import SignUp from "../routes/Auth/SignUp";
import Profile from "../routes/Profile/Profile";
// import Cart from "../routes/Cart/Cart";
const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile userObj={userObj} />
            </Route>
          </>
        ) : (
          <>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/sign-up">
              <SignUp />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
