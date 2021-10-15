import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router';
import ReactNotification from 'react-notifications-component';
import { useDispatch } from 'react-redux';
import R from 'ramda';

import { attemptGetUser } from '_thunks/user';

import WelcomePage from '_pages/WelcomePage';
import LoginPage from '_pages/LoginPage';
import RegisterPage from '_pages/RegisterPage';
import RoutingPage from '_pages/RoutingPage';
import AboutPage from '_pages/AboutPage';

// import Navigation from '_organisms/Navigation';
// import Footer from '_organisms/Footer';

export default function Main({ location }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscribed = true;

    dispatch(attemptGetUser())
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
            <Route path="/leftpane" component={RoutingPage} />

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
