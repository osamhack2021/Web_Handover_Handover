import React from 'react';
import PropTypes from 'prop-types';

import FilledBookmark from '_assets/svgs/bookmark-filled.svg';
import Bookmark from '_assets/svgs/bookmark.svg';
import ClockIcon from '_assets/svgs/clock_icon.svg';

import CustomButton from '_atoms/CustomButton';

export default function NoteFooter({ dateFromNow, bookmarkBoolean, onBookmarkCard }) {
  const bookmarkSrc = bookmarkBoolean ? FilledBookmark : Bookmark;
  return (
    <div className="note-footer">
      <div className="date-from-now">
        <img className="clock-icon" src={ClockIcon} alt="clock-icon" />
        {dateFromNow}
      </div>
      <CustomButton imgSrc={bookmarkSrc} alt="duplicate" type="button" onClick={onBookmarkCard} />
    </div>
  );
}

NoteFooter.propTypes = {
  dateFromNow: PropTypes.string.isRequired,
  onBookmarkCard: PropTypes.func.isRequired,
  bookmarkBoolean: PropTypes.bool.isRequired,
};
