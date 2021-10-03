import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { none } from 'ramda';

export default function MenuItem({ value }) {
  const { title, link } = value;
  return (
    <Link to={link} className="leftpane-item">{title}</Link>
  );
}

MenuItem.propTypes = {
  value: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};
