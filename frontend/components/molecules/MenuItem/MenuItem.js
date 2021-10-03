import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function MenuItem({ value }) {
  const { title, link, src, alt } = value;
  if (src === undefined && alt === undefined) {
    return (
      <Link to={link} className="leftpane-item">
        {title}
      </Link>
    );
  }
  return (
    <Link to={link} className="leftpane-item">
      <img src={src} alt={alt} />
      &nbsp; {title}
    </Link>
  );
}

MenuItem.propTypes = {
  value: PropTypes.object.isRequired,
};
