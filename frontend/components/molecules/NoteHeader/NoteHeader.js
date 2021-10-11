import React from 'react';
import PropTypes from 'prop-types';

import Duplicate from '_assets/svgs/duplicate.svg';
import Bookmark from '_assets/svgs/bookmark.svg';
import BookmarkFilled from '_assets/svgs/bookmark-filled.svg';

import CustomButton from '_atoms/CustomButton';
import CardDropdown from '_molecules/CardDropdown';

// access groups is an object
export default function NoteHeader({
  title, isArchived, onClick, groupObjectArray, permissionId, onChangePermission,
}) {
  const bookmarkRender = isArchived ? '' : 'hidden';
  const bookmarkSrc = isArchived ? BookmarkFilled : Bookmark;
  return (
    <div className="note-header">
      <div className="main-title" onClick={onClick}>
        {title}
      </div>
      <div className="button-group">
        <CardDropdown
          groupObjectArray={groupObjectArray}
          onChangePermission={onChangePermission}
          permissionId={permissionId}
        />
      </div>
    </div>
  );
}

NoteHeader.propTypes = {
  title: PropTypes.string.isRequired,
  isArchived: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  groupObjectArray: PropTypes.arrayOf(Object).isRequired,
  permissionId: PropTypes.string.isRequired,
  onChangePermission: PropTypes.func.isRequired,
};
