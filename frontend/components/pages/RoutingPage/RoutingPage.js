import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { Switch, Route, Redirect } from "react-router";
import R from "ramda";

import LeftPane from "_organisms/LeftPane";
import Header from "_organisms/Header";
import ItemPage from "_pages/ItemPage";
import TestPage from "_pages/TestPage";
import EditorPage from "_pages/EditorPage";
import SettingsPage from "_pages/SettingsPage";
import RecoveryPage from "_pages/RecoveryPage";
import ProfilePage from "_pages/ProfilePage";
import RecommendPage from "_pages/RecommendPage";
import { attemptGetGroup } from "_thunks/group";
import { attemptLoadItems } from "_thunks/item";
import SearchPage from "_pages/SearchPage";
import { login } from "_frontend/store/actions/user";

export default function RoutingPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(["user"]));

  // to identify whether all contents are loaded or not
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingItem, setLoadingItem] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      const user = localStorage.getItem("user");

      if (user == null) dispatch(push("/login"));
      else dispatch(login(JSON.parse(user)));
    } else {
      dispatch(attemptGetGroup(user.group))
        .catch(R.identity)
        .then(() => setLoadingGroup(false));

      dispatch(attemptLoadItems(user.Id))
        .catch(R.identity)
        .then(() => setLoadingItem(false));
    }
  }, []);

  return (
    !loadingGroup &&
    !loadingItem && (
      <div className="page-template">
        <div className="left-pane-container">
          <LeftPane />
        </div>
        <div className="home-page">
          <Header />
          <Switch>
            {/* Home Page */}
            <Route path="/home" component={TestPage} />
            {/* Search Page */}
            <Route path="/search/:searchQuery" component={SearchPage} />

            {/* Account Page */}
            <Route path="/account" component={ProfilePage} />
            <Route path="/account/settings" component={SettingsPage} />
            <Route path="/account/recovery" component={RecoveryPage} />

            {/* Item Page */}
            <Route path="/create" component={EditorPage} />
            <Route path="/item/:itemId" component={ItemPage} />
            <Route path="/item/:itemId/edit" component={EditorPage} />
            <Route path="/item/:itemId/settings" component={EditorPage} />
            
            {/* User Profile Page */}
            <Route path="/user/:id" component={ProfilePage} />
            <Route path="/user/:id/items" component={ProfilePage} />

            {/* Not Found Page */}
            <Route path="*">
              <Redirect to="/error" />
            </Route>
          </Switch>
        </div>
      </div>
    )
  );
}
