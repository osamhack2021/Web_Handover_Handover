import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Breadcrumbs } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { snakeToCamelCase } from 'json-style-converter/es5';

import BreadCrumb from '_molecules/BreadCrumb';
import listToComponent from '_utils/listToComponent';
import { getItemByItemId } from '_api/item';

export default function GridHeader({ pathArray = [], title }) {
  return (
    <div className="grid-header">
      <div>
        <Breadcrumbs separator=">">
          {listToComponent(BreadCrumb, pathArray, 'Id')}
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
