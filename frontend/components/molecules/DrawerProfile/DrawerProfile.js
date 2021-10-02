import React from 'react';
import PropTypes from 'prop-types';

export default function DrawerProfile({
  name = '', rank = '', division = '', title = '', profilePic = '',
}) {
  const aboveString = `${rank} ${name}`;
  const belowString = `${division} ${title}`;

  return (
    <div className="drawer-profile">
      <img
        className="profile-img"
        src={profilePic || '/images/default-profile.png'}
        alt="profile"
      />
      <div>
        <div className="profile-string-above">
          {aboveString}
        </div>
        <div className="profile-string-below">
          {belowString}
        </div>
      </div>
    </div>
  );
}

DrawerProfile.propTypes = {
  name: PropTypes.string.isRequired,
  rank: PropTypes.string.isRequired,
  division: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  profilePic: PropTypes.string.isRequired,
};
