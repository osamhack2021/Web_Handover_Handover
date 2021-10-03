import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Switch, Route } from 'react-router';
import R from 'ramda';

import LeftPane from '_organisms/LeftPane';
import HomePage from '_pages/HomePage';
import RecommendPage from '_pages/RecommendPage';
import LoginPage from '_pages/LoginPage';
import RegisterPage from '_pages/RegisterPage';

export default function RoutingPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  // to identify whether all contents are loaded or not
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingItem, setLoadingItem] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    } else {
      dispatch(attemptGetGroup())
        .catch(R.identity)
        .then(() => setLoadingGroup(false));

      dispatch(attemptLoadItems())
        .catch(R.identity)
        .then(() => setLoadingItem(false));
    }
  }, []);

  return !loadingGroup && !loadingItem && (
    <div className="page-template">
      <div className="left-pane-container">
        <LeftPane />
      </div>
      <Switch>
        {/* <Route path="/blahblahbalh" component={anything} /> */}
        <Route path="/home" component={HomePage} />
        <Route path="/recommend" component={RecommendPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
      </Switch>
    </div>
  );
}
