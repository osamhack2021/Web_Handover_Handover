import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function BreadCrumb({ value, link }) {
  const { Id, title } = value;
  return (
    <Link to={link} className="breadcrumb">{title}</Link>
  );
}

BreadCrumb.propTypes = {
  value: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};
