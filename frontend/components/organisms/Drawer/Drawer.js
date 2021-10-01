import React from 'react';
import PropTypes from 'prop-types';

import Menu from 'react-bulma-companion/lib/Menu';
import DrawerProfile from '_molecules/DrawerProfile';
import MenuItem from '_molecules/MenuItem';

export default function Drawer({name, rank, title, division,}) {
  return (
    <div className="drawer">
      <DrawerProfile name="야옹이" rank="하사" division="0사단 00연대" title="짬타이거" />
      <Menu className="drawer-menu">
        <Menu.Label className="drawer-label">
          ME
        </Menu.Label>
        <Menu.List className="drawer-list">
          <MenuItem value={{
            name: '프로필',
            link: '/',
          }}
          />
          <MenuItem value={{
            name: '테마 변경',
            link: '/',
          }}
          />
        </Menu.List>
        <Menu.Label className="drawer-label">
          TEAM
        </Menu.Label>
        <Menu.List className="drawer-list">
          <MenuItem value={{
            name: '문서 권한 수정',
            link: '/',
          }}
          />
          <MenuItem value={{
            name: '알림',
            link: '/',
          }}
          />
        </Menu.List>
      </Menu>
    </div>
  );
}

Drawer.propTypes = {
  name: PropTypes.string.isRequired,
  rank: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  division: PropTypes.string.isRequired,
};
