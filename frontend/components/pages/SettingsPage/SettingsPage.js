import React from 'react';
import { Switch, Route } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import R from 'ramda';

import ProfileSettings from '_organisms/ProfileSettings';
import GroupSettings from '_organisms/GroupSettings';
import Drawer from '_organisms/Drawer';

import User from '_assets/svgs/user.svg';

export default function SettingsPage() {
  const { user } = useSelector(R.pick(['user']));
  const menulist = [
    'ME',
    [
      {title: '프로필', src: User, alt: 'user', link: '/account/settings'},
      {title: '테마 변경', src: User, alt: 'themechange', link: '/account/settings/theme'},
    ],
    'TEAM',
    [
      {title: '그룹 관리', src: User, alt: 'auth', link: '/account/settings/groups'},
      {title: '알림', src: User, alt: 'alert', link: '/account/settings/alerts'},
    ],
  ];
  
  return (
    <div className="page-template">
      <div className="drawer-container">
        {/*이곳의 drawer에는 현재 User의 Id가 들어가면 됨*/}
        <Drawer menulist={menulist} Id={user.Id} />
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