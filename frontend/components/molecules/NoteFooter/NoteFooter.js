import React from 'react';
import PropTypes from 'prop-types';

import ShowContent from '_assets/svgs/show_content.svg';
import Print from '_assets/svgs/print.svg';
import Comment from '_assets/svgs/comment.svg';
import ClockIcon from '_assets/svgs/clock_icon.svg';

import CustomButton from '_atoms/CustomButton';

export default function NoteFooter({ dateFromNow, printFunc, commentFunc, showContentFunc }) {
  return (
    <div className="note-footer">
      <div className="date-from-now">
        <img className="clock-icon" src={ClockIcon} alt="clock-icon" />
        {dateFromNow}
      </div>
      <div className="hidden">
        <CustomButton imgSrc={Print} alt="duplicate" type="button" onClick={printFunc} />
        <CustomButton imgSrc={Comment} alt="duplicate" type="button" onClick={commentFunc} />
        <CustomButton imgSrc={ShowContent} alt="duplicate" type="button" onClick={showContentFunc} />
      </div>
    </div>
  );
}

NoteFooter.propTypes = {
  dateFromNow: PropTypes.string.isRequired,
  printFunc: PropTypes.func.isRequired,
  commentFunc: PropTypes.func.isRequired,
  showContentFunc: PropTypes.func.isRequired,
};
