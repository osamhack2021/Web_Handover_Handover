import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import R from 'ramda';

import HorizontalHeader from '_organisms/HorizontalHeader';
import HorizontalContent from '_organisms/HorizontalContent';
import PromiseItemArray from '_utils/promiseArray';
import { snakeToCamelCase } from 'json-style-converter/es5';
import { getItemByItemId } from '_api/item';

export default function BookmarkPage() {
  const { user } = useSelector(R.pick(['user']));
  const [bookmarkObjects, setBookmarkObjects] = useState({ cabinet: [], document: [], card: [] });
  const [loading, setLoading] = useState(true);
  const bookmarkArrays = user.bookmarks;

  useEffect(() => {
    Promise.all(bookmarkArrays.map((elem) => getItemByItemId(elem))).then((objectArray) => {
      const camelObjectArray = snakeToCamelCase(objectArray);
      setBookmarkObjects({
        cabinet: camelObjectArray.filter((elem) => elem.type === 'cabinet'),
        document: camelObjectArray.filter((elem) => elem.type === 'document'),
        card: camelObjectArray.filter((elem) => elem.type === 'card'),
      });
      setLoading(false);
    });
  }, []);

  return !loading && (
    <div className="recommend-page">
      <div className="recommend-page-header">
        북마크
      </div>
      <div className="recommend-container">

        {
            (bookmarkObjects.cabinet === [])
              ? '북마크가 없습니다.'
              : (
                <div className="recommend-block">
                  <HorizontalHeader type="cabinet" />
                  <hr />
                  <HorizontalContent type="cabinet" cardArray={bookmarkObjects.cabinet} />
                </div>
              )
        }
        {
            (bookmarkObjects.document === [])
              ? '북마크가 없습니다.'
              : (
                <div className="recommend-block">
                  <HorizontalHeader type="document" />
                  <hr />
                  <HorizontalContent type="document" cardArray={bookmarkObjects.document} />
                </div>
              )
        }
        {
            (bookmarkObjects.card === [])
              ? '북마크가 없습니다.'
              : (
                <div className="recommend-block">
                  <HorizontalHeader type="card" />
                  <hr />
                  <HorizontalContent type="card" cardArray={bookmarkObjects.card} />
                </div>
              )
        }
      </div>
    </div>
  );
}
