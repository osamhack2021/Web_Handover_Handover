import React from 'react';
import PropTypes from 'prop-types';

import Menu from 'react-bulma-companion/lib/Menu';

import ProfileMenu from '_molecules/ProfileMenu';
import MenuItem from '_molecules/MenuItem';
import listToCompnent from '../../../utils/listToComponent';

export default function LeftPane({
  name, rank, title, division, groupData,
}) {
  // const { user } = useSelector(R.pick(['user']));
  // const {name, rank, title, groups} = user;
  // const groupData = CreateGroupData(groups);

  return (
    <div className="leftpane">
      <div className="leftpane-header">
        <ProfileMenu name={name} rank={rank} title={title} division={division} position="인사담당관" />
      </div>
      <Menu className="leftpane-menu">
        <Menu.Label className="leftpane-label">
          내 서랍
        </Menu.Label>
        <Menu.List>
          {listToCompnent(MenuItem, groupData, '_id')}
        </Menu.List>
        <Menu.Label className="leftpane-label">
          내 문서
        </Menu.Label>
        <Menu.List>
          <MenuItem value={{
            name: '최근에 본',
            link: '/',
          }}
          />
          <MenuItem value={{
            name: '북마크',
            link: '/',
          }}
          />
          <MenuItem value={{
            name: '임시저장',
            link: '/',
          }}
          />
        </Menu.List>
        <Menu.Label className="leftpane-label">
          기타
        </Menu.Label>
        <Menu.List>
          <MenuItem value={{
            name: '도움말',
            link: '/',
          }}
          />
        </Menu.List>
      </Menu>
    </div>
  );
}

LeftPane.propTypes = {
  name: PropTypes.string.isRequired,
  rank: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  division: PropTypes.string.isRequired,
  groupData: PropTypes.arrayOf(PropTypes.object).isRequired,
};
