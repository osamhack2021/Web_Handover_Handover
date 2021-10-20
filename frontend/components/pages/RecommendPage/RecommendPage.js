import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';

import { attemptGetUserItem } from '_frontend/store/thunks/item';
import ItemListSection from '_frontend/components/templates/ItemListSection';
import { store as RNC } from 'react-notifications-component';

export default function RecommendPage({ location }) {
  const dispatch = useDispatch();
  // if user exists, means a user has logged in, i.e. item, group items are available
  const { user } = useSelector(R.pick(['user']));
  const { itemCache } = useSelector(R.pick(['itemCache']));
  console.log('recommendpage');
  console.log(user);
  console.log(itemCache);
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(true);
  document.title = 'Home - Handover';

  useEffect(() => {
    if (Object.keys(itemCache).length === 0) {
      console.log('rendering through api request');
      dispatch(attemptGetUserItem(user._id))
        .catch(() => {
          setLoading(false);
          RNC.addNotification({
            title: '서버 오류',
            type: 'error',
            message: '서버로부터 항목들을 불러오지 못했습니다.',
            container: 'top-center',
            animationIn: ['animated', 'fadeInRight'],
            animationOut: ['animated', 'fadeOutRight'],
            dismiss: {
              duration: 5000,
            },
          });
        })
        .then((data) => {
          setItemList(data);
          setLoading(false);
        });
    } else {
      console.log('rendering from itemCache');
      setItemList(Object.values(itemCache));
      setLoading(false);
    }
  }, []);

  return (
    !loading && <ItemListSection title={`${user.name}님, 좋은 아침입니다!`} items={itemList} />
  );
}

RecommendPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};
