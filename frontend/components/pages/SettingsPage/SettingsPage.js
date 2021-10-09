import React from 'react';
import { Switch, Route } from 'react-router';

import ProfileSettings from '_organisms/ProfileSettings';
import GroupSettings from '_organisms/GroupSettings';
import Drawer from '_organisms/Drawer';

import User from '_assets/svgs/user.svg';

export default function SettingsPage() {
  const menulist = [
    'ME',
    [
      {title: '프로필', src: User, alt: 'user', link: '/setting/profile'},
      {title: '테마 변경', src: User, alt: 'themechange', link: '/setting/themechange'},
    ],
    'TEAM',
    [
      {title: '그룹 관리', src: User, alt: 'auth', link: '/setting/group'},
      {title: '알림', src: User, alt: 'alert', link: '/'},
    ],
  ];
  
  return (
    <div className="page-template">
      <div className="drawer-container">
        <Drawer menulist={menulist} />
      </div>
      <div className="setting-page">
        <Switch>
          {/* <Route path="/setting/themechange" component={} /> */}
          <Route path="/setting/group" component={GroupSettings} />
          <Route path="/setting" component={ProfileSettings} />
        </Switch>
      </div>
    </div>
  )
}