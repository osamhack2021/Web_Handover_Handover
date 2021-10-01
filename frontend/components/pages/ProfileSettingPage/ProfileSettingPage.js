import React from 'react';
import ProfileSettings from '_organisms/ProfileSettings';
import Drawer from '_organisms/Drawer';

export default function ProfileSettingPage() {
  return (
    <div className="page-template">
      <div className="drawer">
        <Drawer />
      </div>
      <div className="profile-setting-page">
        <ProfileSettings />
      </div>
    </div>
  )
}