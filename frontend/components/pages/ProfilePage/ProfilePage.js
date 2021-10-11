import React from 'react';
import { Switch, Route } from 'react-router';
import { useParams } from 'react-router';

import Profile from '_organisms/Profile';
import WrittenCards from '_organisms/WrittenCards';
import Drawer from '_organisms/Drawer';

import User from '_assets/svgs/user.svg';

export default function ProfilePage() {
  const {id} = useParams();
  console.log("ProfilePage에서 Id: " + Id);
  const menulist = [
    '사용자 정보',
    [
      { title: '사용자 정보', src: User, alt: 'user', link: `/user/${Id}` },
      { title: '작성한 문서', src: User, alt: 'documents', link: `/user/${Id}/items` },
    ],
  ];
  return (
    <div className="page-template">
      <div className="drawer-container">
        {/*이 곳의 Drawer에는 보여줄 프로필의 주인의 Id가 들어가면 됨*/}
        <Drawer menulist={menulist} Id={Id} />
      </div>
      <div className="profile-page">
        <Switch>
          {/* parameter을 통해 보여줄 profile의 id를 넘겨줌 */}
          <Route path="/user/:id/items" component={WrittenCards} />
          <Route path="/user/:id" component={Profile} />
        </Switch>
      </div>
    </div>
  );
}
// Drawer의 menu 목록 높이는 menu에 넣을 기능들이 확정되면 수정하겠습니다.
