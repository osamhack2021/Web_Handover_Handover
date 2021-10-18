import PropTypes from "prop-types";
import R from "ramda";
import React, { useEffect, useState } from "react";
import ReactNotification from "react-notifications-component";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import AboutPage from "_pages/AboutPage";
import LoginPage from "_pages/LoginPage";
import RegisterPage from "_pages/RegisterPage";
import RoutingPage from "_pages/RoutingPage";
import WelcomePage from "_pages/WelcomePage";
import { attemptGetCurrentUser } from "_thunks/user";

export default function Main({ location }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscribed = true;

    dispatch(attemptGetCurrentUser())
      .catch(R.identity)
      .then(() => subscribed && setLoading(false));

    return () => {
      subscribed = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    !loading && (
      <div>
        <ReactNotification />
        {/* <Navigation pathname={location.pathname} /> */}
        <div className="main">
          <Switch>
            <Route exact path="/" component={WelcomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/help" component={WelcomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />

            {/* Following routes are with LeftPane and require authentication */}
            <Route path="/home" component={RoutingPage} />
            <Route path="/search" component={RoutingPage} />
            <Route path="/create" component={RoutingPage} />
            <Route path="/item" component={RoutingPage} />
            <Route path="/account" component={RoutingPage} />
            <Route path="/user" component={RoutingPage} />
            <Route exact path="/bookmarks" component={RoutingPage} />
            <Route exact path="/recents" component={RoutingPage} />
            <Route exact path="/drafts" component={RoutingPage} />

            {/* 404 Fallback page */}
            <Route path="/error">
              <div>페이지를 찾을 수 없습니다.</div>
            </Route>
            <Route path="*">
              <Redirect to="/error" />
            </Route>
          </Switch>
        </div>
        {/* <Footer /> */}
      </div>
    )
  );
}

Main.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};
