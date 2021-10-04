import React from 'react';
import { Switch, Route } from 'react-router';

import Profile from '_organisms/Profile';
import WrittenCards from '_organisms/WrittenCards';
import Drawer from '_organisms/Drawer';

import User from '_assets/svgs/user.svg';

export default function ProfilePage() {
  const menulist = [
    '사용자 정보',
    [
      {title: '사용자 정보', src: User, alt: 'user', link: '/profile'},
      {title: '작성한 문서', src: User, alt: 'documents', link: '/profile/writtencards'},
    ],
  ];
  return (
    <div className="page-template">
      <div className="drawer-container">
        <Drawer name="야옹이" rank="이병" title="짬타이거" division="0사단 00연대" menulist={menulist} />
      </div>
      <div className="profile-page">
        <Switch>
          <Route path="/profile/writtencards" component={WrittenCards} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </div>
    </div>
  );
}
// Drawer의 menu 목록 높이는 menu에 넣을 기능들이 확정되면 수정하겠습니다.
