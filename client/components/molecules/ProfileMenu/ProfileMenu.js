import React from 'react';

export default function ProfileMenu({ name = '', rank = '', division = '', title = '' }) {
  const aboveString = `${rank} ${name}`;
  const belowString = `${division} ${title}`;

  return (
    <div className="profile-menu">
      <div className="profile-string-above">
        {aboveString}
      </div>
      <div className="profile-string-below">
        {belowString}
      </div>
    </div>
  );
}
