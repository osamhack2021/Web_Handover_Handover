import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function BreadCrumb({ value }) {
  console.log(value);
	const {url, name} = value;
  return (
    <Link to={url} className="breadcrumb">{name}</Link>
  );
}

BreadCrumb.propTypes = {
  value: PropTypes.object.isRequired,
};
