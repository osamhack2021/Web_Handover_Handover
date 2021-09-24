import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Breadcrumbs } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import BreadCrumb from '_molecules/BreadCrumb';
import listToComponent from '_utils/listToComponent';

// expecting parameter pathArr to be a type of
// [
//   {
//     _id : 1,
//     name : '',
//     url : ''
//   }
// ]
const useStyles = makeStyles({
  breadcrumbs: `
    font-family: Inter,
    font-style: normal,
    font-weight: 600,
    font-size: 20px,
  `,
});

export default function GridHeader({ pathArr = [], title}) {
  const classes = useStyles();
  const dummyTitle = "재고 관리"
  const dummyPathArr = [
    {
      _id: 1,
      name: 'PX 관리병',
      url: '/',
    },
    {
      _id: 2,
      name: '물품 관리',
      url: '/',
    },
  ];

  return (
    <div className="search-bar">
      <div>
        <Breadcrumbs separator=">">
          {listToComponent(BreadCrumb, dummyPathArr, '_id')}
        </Breadcrumbs>
        {dummyTitle}
      </div>
    </div>
  );
}

GridHeader.propTypes = {
  pathArr: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};
