import React from 'react';
import PropTypes from 'prop-types';
import { getGroupByGroupId } from '_api/group';
import { getUser } from '_api/user';

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

export default function Drawer({ Id, menulist }) {
  console.log("Drawer에서 Id: " + Id);
  const user = getUser(Id).then(
    data => data
  ).catch(
    error => console.log(error)
  );
  console.log(user);
  const group = getGroupByGroupId(user.group).then(
    data => data
  ).catch(
    error => console.log(error)
  );
  console.log(group);
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
  Id: PropTypes.string.isRequired,
  menulist: PropTypes.array.isRequired,
};
