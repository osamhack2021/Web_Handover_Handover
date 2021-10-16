import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Breadcrumbs } from '@mui/material';
import { snakeToCamelCase } from 'json-style-converter/es5';

import BreadCrumb from '_molecules/BreadCrumb';
import { getItem } from '_api/item';

function arrayToBreadCrumb(array) {
  return array.map((elem) => <BreadCrumb key={elem.Id} link={`/item/${elem.Id}`} value={elem} />);
}
export default function GridHeader({ pathArray = [], title }) {
  return (
    <div className="grid-header">
      <div>
        <Breadcrumbs separator=">">
          {arrayToBreadCrumb(pathArray)}
        </Breadcrumbs>
        {title}
      </div>
    </div>
  );
}

GridHeader.propTypes = {
  pathArray: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};
