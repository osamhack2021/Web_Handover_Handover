import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { snakeToCamelCase } from 'json-style-converter/es5';

import GridHeader from '_organisms/GridHeader';
import GridLayout from '_organisms/GridLayout';
import { getItemByItemId, getItemChild } from '_api/item';
import PromiseItemArray from '_utils/promiseArray';
import Comment from '_organisms/Comment';
import user from '_frontend/store/reducers/user';

export default function ItemPage({ location }) {
  const [loadingPath, setLoadingPath] = useState(true);
  const [loadingChild, setLoadingChild] = useState(true);
  const [pathObject, setPathObject] = useState({});
  const [childObject, setChildObject] = useState({});
  const [item, setItem] = useState({});
  const { itemId } = useParams();

  useEffect(() => {
    console.log(`Home rendering with itemId : ${itemId}`);
    getItemByItemId(itemId).then((data) => {
      const camelData = snakeToCamelCase(data);
      // setting Item
      setItem(camelData);

      // setting path array Promise
      const pathArray = camelData.path.split(',');
      PromiseItemArray(pathArray, setPathObject, setLoadingPath, 'pathArray');

      // setting children array Promise
      getItemChild(camelData.path).then((array) => {
        setChildObject({ childArray: snakeToCamelCase(array) });
        setLoadingChild(false);
      });
    });

    // setting recents of localstorage
    const recentArray = JSON.parse(localStorage.getItem('recents'));
    if (!recentArray.includes(itemId)) {
      if (recentArray.length > 20) {
        localStorage.setItem('recents', JSON.stringify([...recentArray, itemId].shift()));
      } else {
        localStorage.setItem('recents', JSON.stringify([...recentArray, itemId]));
      }
    }
  }, [location]);

  return !loadingPath && !loadingChild && (
  // <div className="home-page">
  // <Header />
  <div>
    <div className="outer-div">
      <div className="grid-container">
        <GridHeader title={item.title} pathArray={pathObject.pathArray} />
        <div className="grid-layout-container">
          <GridLayout cardArray={childObject.childArray} />
        </div>
      </div>
    </div>
    {item.comments.map((elem) => <Comment key={item.comments.indexOf(elem)} commentObject={elem} />)}
  </div>
  );
}

ItemPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};
