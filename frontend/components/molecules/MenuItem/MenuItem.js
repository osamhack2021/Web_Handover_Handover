import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { none } from 'ramda';

export default function MenuItem({ value }) {
  const { title, Id } = value;
  let link;
  if (Id === null) {
    link = value.link;
  } else {
    link = `/item/${Id}`;
  }
  return (
    <Link to={link} className="leftpane-item">{title}</Link>
  );
}

MenuItem.propTypes = {
  value: PropTypes.object.isRequired,
};
