import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import R from 'ramda';

import HorizontalHeader from '_organisms/HorizontalHeader';
import HorizontalContent from '_organisms/HorizontalContent';
import PromiseItemArray from '_utils/promiseArray';
import { snakeToCamelCase } from 'json-style-converter/es5';
import { getItemByItemId } from '_api/item';
import { object } from 'prop-types';

export default function ItemListPage() {
  const { user } = useSelector(R.pick(['user']));
  const { userItem } = useSelector(R.pick(['userItem']));
  const [title, setTitle] = useState('');
  const [itemObjects, setItemObjects] = useState({ cabinet: [], document: [], card: [] });
  const [loading, setLoading] = useState(true);
  const { path } = useParams();

  useEffect(() => {
    // setting the array w.r.t. the path given
    console.log(`loading bookmarks with :${user.bookmarks}`);
    let array;
    switch (path) {
      case 'bookmarks':
        setTitle('북마크');
        array = user.bookmarks;
        break;
      case 'myitems':
        setTitle('내가 작성한 문서');
        array = userItem;
        break;
      case 'recents':
        setTitle('최근 문서');
        array = JSON.parse(localStorage.getItem('recents'));
        break;
      case 'drafts':
        setTitle('임시저장 문서');
        array = userItem.filter((elem) => elem.status === 'draft');
        break;
      default:
        array = [];
    }

    // the array can be either an array of item objectss we wish to render
    // or the array of item ids
    Promise.all(array.map((elem) => {
      if (typeof elem === 'object') {
        return elem;
      }
      return getItemByItemId(elem);
    })).then((objectArray) => {
      const camelObjectArray = snakeToCamelCase(objectArray);
      setItemObjects({
        cabinet: camelObjectArray.filter((elem) => elem.type === 'cabinet'),
        document: camelObjectArray.filter((elem) => elem.type === 'document'),
        card: camelObjectArray.filter((elem) => elem.type === 'card'),
      });
      setLoading(false);
    });
  }, [path, user]);

  return !loading && (
    <div className="recommend-page">
      <div className="recommend-page-header">
        {title}
      </div>
      <div className="recommend-container">

        {
            (itemObjects.cabinet.length === 0)
              ? ''
              : (
                <div className="recommend-block">
                  <HorizontalHeader type="cabinet" />
                  <hr />
                  <HorizontalContent type="cabinet" cardArray={itemObjects.cabinet} />
                </div>
              )
        }
        {
            (itemObjects.document.length === 0)
              ? ''
              : (
                <div className="recommend-block">
                  <HorizontalHeader type="document" />
                  <hr />
                  <HorizontalContent type="document" cardArray={itemObjects.document} />
                </div>
              )
        }
        {
            (itemObjects.card.length === 0)
              ? ''
              : (
                <div className="recommend-block">
                  <HorizontalHeader type="card" />
                  <hr />
                  <HorizontalContent type="card" cardArray={itemObjects.card} />
                </div>
              )
        }
      </div>
    </div>
  );
}
