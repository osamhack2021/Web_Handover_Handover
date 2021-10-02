import React from 'react';
import ProfileSettings from '_organisms/ProfileSettings';
import Drawer from '_organisms/Drawer';

import User from '_assets/svgs/user.svg';

export default function SettingsPage() {
  const menulist = [
    'ME',
    [
      {name: '프로필', src: User, alt: 'user', link: '/'},
      {name: '테마 변경', src: User, alt: 'themechange', link: '/'},
    ],
    'TEAM',
    [
      {name: '문서 권한 수정', src: User, alt: 'auth', link: '/'},
      {name: '알림', src: User, alt: 'alert', link: '/'},
    ],
  ];
  return (
    <div className="page-template">
      <div className="drawer">
        <Drawer name="야옹이" rank="이병" title="짬타이거" division="0사단 00연대" menulist={menulist} />
      </div>
      <div className="setting-page">
        <ProfileSettings />
      </div>
    </div>
  )
}