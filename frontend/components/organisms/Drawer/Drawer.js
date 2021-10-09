import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

import { useDispatch, useSelector } from 'react-redux';

import DrawerProfile from '_molecules/DrawerProfile';
import MenuItem from '_molecules/MenuItem';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
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

function arrayToMenuItems(array) {
  return array.map((elem, index) => (
    <ListItem disableGutters sx={{ py: 0 }} key={index}>
      <ListItemButton disableGutters sx={{ py: 0 }}>
        <MenuItem key={elem.Id} value={{ title: elem.title, Id: elem.Id, link: `/item/${elem.Id}` }} />
      </ListItemButton>
    </ListItem>
  ));
}

export default function Drawer({ menulist }) {
  const dispatch = useDispatch();

  const { user } = useSelector(R.pick(['user']));
  const { group } = useSelector(R.pick(['group']));


  return (
    <div className="drawer">
      <DrawerProfile name={user.name} rank={user.rank} division={group.name} title={user.title} />
      <div className="drawer-menu">
        {
          menulist.map((list, index) => {
            if (typeof list === 'string') {
              return (
                <ListSubheader className="drawer-label" key={index}> {list} </ListSubheader>
              );
            }
            return (
              list.map((item, listIndex) => (
                <ListItem disableGutters sx={{ py: 0 }} key={index}>
                  <ListItemButton disableGutters sx={{ py: 0 }}>
                    <MenuItem key={listIndex} value={item} />
                  </ListItemButton>
                </ListItem>
              ))
            );
          })
        }
      </div>
    </div>
  );
}

Drawer.propTypes = {
  menulist: PropTypes.array.isRequired,
};
