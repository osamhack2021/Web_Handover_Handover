import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function BreadCrumb({ value }) {
  const { Id, title } = value;
  return (
    <Link to={`/item/${Id}`} className="breadcrumb">{title}</Link>
  );
}

BreadCrumb.propTypes = {
  value: PropTypes.object.isRequired,
};
