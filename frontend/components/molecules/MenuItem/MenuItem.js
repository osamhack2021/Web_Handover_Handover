import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function MenuItem({ value }) {
  const { name, link } = value;
  return (
    <Link to={link} className="leftpane-item">{name}</Link>
  );
}

MenuItem.propTypes = {
  value: PropTypes.object.isRequired,
};
