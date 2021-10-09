import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

import { useDispatch, useSelector } from 'react-redux';

import Menu from 'react-bulma-companion/lib/Menu';
import DrawerProfile from '_molecules/DrawerProfile';
import MenuItem from '_molecules/MenuItem';

/*
Example of menulist :
const menulist = [
  'ME',
  [
    {title: '프로필', src: User, alt: 'user', link: '/'},
    {title: '테마 변경', src: ThemeChange, alt: 'themechange', link: '/'},
  ]  ,
  'TEAM',
  [
    {title: '문서 권한 수정', src: Auth, alt: 'auth', link: '/'},
    {title: '알림', src: Alert, alt: 'alert', link: '/'},
  ],
];
*/
export default function Drawer({ menulist }) {
  const dispatch = useDispatch();

  const { user } = useSelector(R.pick(['user']));
  const { group } = useSelector(R.pick(['group']));


  return (
    <div className="drawer">
      <DrawerProfile name={user.name} rank={user.rank} division={group.name} title={user.title} />
      <Menu className="drawer-menu">
        {
          menulist.map((list, index) => {
            if (typeof list === 'string') {
              return (
                <Menu.Label className="drawer-label" key={index} >
                  {list}
                </Menu.Label>
              );
            }
            return (
              <Menu.List className="drawer-list" key={index}>
                {
                  list.map((item, listIndex) => (
                    <MenuItem value={item} key={listIndex} />
                  ))
                }
              </Menu.List>
            );
          })
        }
      </Menu>
    </div>
  );
}

Drawer.propTypes = {
  menulist: PropTypes.array.isRequired,
};
