import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router';
import { snakeToCamelCase } from 'json-style-converter/es5';
import { parse } from 'query-string';

import GridHeader from '_organisms/GridHeader';
import GridLayout from '_organisms/GridLayout';
import Header from '_organisms/Header';
import { getItemByItemId } from '_api/item';

export default function HomePage({ location }) {
  const [loadingPath, setLoadingPath] = useState(true);
  const [loadingChild, setLoadingChild] = useState(true);
  const [pathObject, setpathObject] = useState({});
  const [item, setItem] = useState({});
  const { itemId } = useParams();
  // const { itemId } = parse(useLocation().itemId);
  // console.log(exampleQuery);
  useEffect(() => {
    console.log(`Home rendering with itemId : ${itemId}`);
    getItemByItemId(itemId).then((data) => {
      // setting Item
      setItem(snakeToCamelCase(data));

      // setting path array Promise
      const pathArray = data.path.split('/');
      Promise.all(pathArray.map((elem) => getItemByItemId(elem))).then((elemItem) => {
        setpathObject((prevState) => ({
          ...prevState,
          pathArray: snakeToCamelCase(elemItem),
        }
        ));
        setLoadingPath(false);
      });
    });
  }, [location]);

  return !loadingPath && (
    <div className="home-page">
      <Header />
      <div className="outer-div">
        <div className="grid-container">
          <GridHeader title={item.title} pathArray={pathObject.pathArray} />
          <div className="grid-layout-container">
            <GridLayout />
          </div>
        </div>
      </div>
    </div>
  );
}

HomePage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};
