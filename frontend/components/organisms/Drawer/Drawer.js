import React from 'react';
import PropTypes from 'prop-types';

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
export default function Drawer({
  name, rank, title, division, menulist,
}) {
  return (
    <div className="drawer">
      <DrawerProfile name={name} rank={rank} division={division} title={title} />
      <Menu className="drawer-menu">
        {
          menulist.map((list) => {
            if (typeof list === 'string') {
              return (
                <Menu.Label className="drawer-label">
                  {list}
                </Menu.Label>
              );
            }
            return (
              <Menu.List className="drawer-list">
                {
                  list.map((item) => (
                    <MenuItem value={item} />
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
  name: PropTypes.string.isRequired,
  rank: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  division: PropTypes.string.isRequired,
  menulist: PropTypes.array.isRequired,
};
