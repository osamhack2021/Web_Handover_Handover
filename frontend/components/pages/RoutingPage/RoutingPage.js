import { push } from 'connected-react-router';
import R from 'ramda';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { login } from '_actions/user';
import Header from '_organisms/Header';
import LeftPane from '_organisms/LeftPane';
import ItemListPage from '_pages/ItemListPage';
import ItemPage from '_pages/ItemPage';
import ProfilePage from '_pages/ProfilePage';
import RecoveryPage from '_pages/RecoveryPage';
import SearchPage from '_pages/SearchPage';
import { attemptGetGroup } from '_thunks/group';
import { attemptGetUserItem } from '_thunks/item';
import CreateItemPage from '../CreateItemPage';
import RecommendPage from '../RecommendPage';

export default function RoutingPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  // to identify whether all contents are loaded or not
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingItem, setLoadingItem] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      const user = localStorage.getItem('user');

      if (user == null) dispatch(push('/login'));
      else dispatch(login(JSON.parse(user)));
    } else {
      dispatch(attemptGetGroup(user.group))
        .catch(R.identity)
        .then(() => setLoadingGroup(false));

      dispatch(attemptGetUserItem(user._id))
        .catch(R.identity)
        .then(() => setLoadingItem(false));
    }
  }, [user]);

  return (
    !loadingGroup
    && !loadingItem && (
      <div className="page-template">
        <div className="left-pane">
          <LeftPane />
        </div>
        <div className="content-pane">
          <Header />
          <div className="content-container">
            <Switch>
              {/* Home Page */}
              <Route path="/home" component={RecommendPage} />

              {/* Search Page */}
              <Route exact path="/search/:searchQuery" component={SearchPage} />

              {/* LeftPane Pages */}
              <Route exact path="/bookmarks" component={ItemListPage} />
              <Route exact path="/recents" component={ItemListPage} />
              <Route exact path="/drafts" component={ItemListPage} />

              {/* Item Page */}
              <Route exact path="/item/create" component={CreateItemPage} />
              <Route exact path="/item/:itemId" component={ItemPage} />
              <Route exact path="/item/:itemId/edit" component={ItemPage} />
              <Route exact path="/item/:itemId/settings" component={ItemPage} />
              <Route exact path="/item/:itemId/history" component={ItemPage} />
              <Route exact path="/item/:itemId/history/:historyItemId" component={ItemPage} />
              <Route exact path="/item/:itemId/inspect" component={ItemPage} />

              {/* Account Page */}
              <Route exact path="/account" component={ProfilePage} />
              <Route exact path="/account/items" component={ProfilePage} />
              <Route exact path="/account/settings" component={ProfilePage} />
              <Route
                exact
                path="/account/settings/group"
                component={ProfilePage}
              />
              <Route exact path="/account/recovery" component={RecoveryPage} />

              {/* User Profile Page */}
              <Route exact path="/user/:userId" component={ProfilePage} />
              <Route exact path="/user/:userId/items" component={ProfilePage} />

              {/* Not Found Page */}
              <Route path="*">
                <Redirect to="/error" />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    )
  );
}
