import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import R from 'ramda';
import PropTypes from 'prop-types';
import { snakeToCamelCase } from 'json-style-converter/es5';
import Menu from 'react-bulma-companion/lib/Menu';

import ProfileMenu from '_molecules/ProfileMenu';
import MenuItem from '_molecules/MenuItem';
import { attemptGetGroup } from '_thunks/group';

function arrayToMenuItems(array) {
  return array.map((elem) => <MenuItem key={elem.Id} link={`/item/${elem.Id}`} value={{ title: elem.title, Id: elem.Id }} />);
}

export default function LeftPane() {
  const dispatch = useDispatch();
  // if user exists, means a user has logged in, i.e. item, group items are available
  const { user } = useSelector(R.pick(['user']));
  const { group } = useSelector(R.pick(['group']));
  const { userItem } = useSelector(R.pick(['userItem']));

  return (
    <div className="leftpane">
      <div className="leftpane-header">
        <ProfileMenu name={user.name} rank={user.rank} title={user.title} division={group.name} />
      </div>
      <Menu className="leftpane-menu">
        <Menu.Label className="leftpane-label">
          내 서랍
        </Menu.Label>
        <Menu.List>
          {arrayToMenuItems(snakeToCamelCase(userItem.cabinet))}
        </Menu.List>
        <Menu.Label className="leftpane-label">
          내 문서
        </Menu.Label>
        <Menu.List>
          <MenuItem value={{
            title: '최근에 본',
            link: '/',
          }}
          />
          <MenuItem value={{
            title: '북마크',
            link: '/',
          }}
          />
          <MenuItem value={{
            title: '임시저장',
            link: '/',
          }}
          />
        </Menu.List>
        <Menu.Label className="leftpane-label">
          기타
        </Menu.Label>
        <Menu.List>
          <MenuItem value={{
            title: '도움말',
            link: '/',
          }}
          />
        </Menu.List>
      </Menu>
    </div>
  );
}
