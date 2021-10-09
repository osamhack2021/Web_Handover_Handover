import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PinkTrapezoid from '_assets/svgs/pink_trapezoid.svg';

export default function ProfileMenu({ name = '', rank = '', division = '', title = '', profilePic = '' }) {
  const aboveString = `${rank} ${name}`;
  const belowString = `${division} ${title}`;

  return (
    <div className="profile-menu">
      <div className="profile-menu-content">
        <Link to="/profile">
          <img
            className="profile-img"
            src={profilePic || '/images/default-profile.png'}
            alt="profile"
          />
        </Link>
        <div>
          <div className="profile-string-above">
            <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>{aboveString}</Link>
          </div>
          <div className="profile-string-below">
            <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}> {belowString} </Link>
          </div>
        </div>
      </div>
      <img alt="pink_trapezoid" className="profile-menu-background" src={PinkTrapezoid} draggable="false" />
    </div>
  );
}

ProfileMenu.propTypes = {
  name: PropTypes.string.isRequired,
  rank: PropTypes.string.isRequired,
  division: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  profilePic: PropTypes.string.isRequired,
};
