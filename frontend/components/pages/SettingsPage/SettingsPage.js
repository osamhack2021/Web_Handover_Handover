import React from "react";
import { Route, Switch } from "react-router";
import GroupSettings from "_organisms/GroupSettings";
import ProfileSettings from "_organisms/ProfileSettings";

export default function SettingsPage() {
  return (
    <div className="setting-page">
      <Switch>
        {/* <Route path="/setting/themechange" component={} /> */}
        <Route exact path="/account/settings/group" component={GroupSettings} />
        <Route exact path="/account/settings" component={ProfileSettings} />
      </Switch>
    </div>
  );
}
