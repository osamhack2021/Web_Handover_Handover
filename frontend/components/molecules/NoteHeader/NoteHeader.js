import React from 'react';
import PropTypes from 'prop-types';

import Duplicate from '_assets/svgs/duplicate.svg';
import Bookmark from '_assets/svgs/bookmark.svg';
import BookmarkFilled from '_assets/svgs/bookmark-filled.svg';

import CustomButton from '_atoms/CustomButton';

export default function NoteHeader({
  title, duplicateFunc, bookmarkFunc, isArchived, onClick,
}) {
  const bookmarkRender = isArchived ? '' : 'hidden';
  const bookmarkSrc = isArchived ? BookmarkFilled : Bookmark;
  return (
    <div className="note-header">
      <div className="main-title" onClick={onClick}>
        {title}
      </div>
      <div className="button-group">
        <div className="hidden">
          <CustomButton imgSrc={Duplicate} alt="duplicate" type="button" onClick={duplicateFunc} />
        </div>
        <div className={bookmarkRender}>
          <CustomButton
            imgSrc={bookmarkSrc}
            alt="bookmark"
            className={bookmarkRender}
            type="button"
            onClick={bookmarkFunc}
          />
        </div>
      </div>
    </div>
  );
}

NoteHeader.propTypes = {
  title: PropTypes.string.isRequired,
  duplicateFunc: PropTypes.func.isRequired,
  bookmarkFunc: PropTypes.func.isRequired,
  isArchived: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
