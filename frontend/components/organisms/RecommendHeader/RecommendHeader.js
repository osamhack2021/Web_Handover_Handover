import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function RecommendHeader({ type, link = '/' }) {
  let title = '';
  switch (type) {
    case 'cabinet':
      title = '서랍';
      break;
    case 'document':
      title = '문서';
      break;
    default:
      title = '카드';
  }

  return (
    <div className="recommend-header">
      <div className="recommend-header-title">
        {title}
      </div>
      <div className="recommend-header-link">
        <Link to={link} className="recommend-link-text">더 보기></Link>
      </div>
    </div>
  );
}

RecommendHeader.propTypes = {
  type: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};
