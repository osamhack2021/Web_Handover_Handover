import PropTypes from 'prop-types';
import R from 'ramda';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getRecommendItem } from '_api/item';
import HorizontalContent from '_organisms/HorizontalContent';
import HorizontalHeader from '_organisms/HorizontalHeader';


export default function RecommendPage({ location }) {
  const [loading, setLoading] = useState(true);
  const [recommendObject, setRecommendObject] = useState({});
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    getRecommendItem(user.Id).then((data) => {
      setRecommendObject(data);
      setLoading(false);
    });
  }, [location]);

  return !loading && (
    <div className="recommend-page">
      <div className="recommend-page-header">
        추천 양식
      </div>
      <div className="recommend-container">
        <div className="recommend-block">
          <HorizontalHeader type="cabinet" />
          <hr />
          <HorizontalContent type="cabinet" cardArray={recommendObject.cabinet} />
        </div>
        <div className="recommend-block">
          <HorizontalHeader type="document" />
          <hr />
          <HorizontalContent type="document" cardArray={recommendObject.document} />
        </div>
        <div className="recommend-block">
          <HorizontalHeader type="card" />
          <hr />
          <HorizontalContent type="card" cardArray={recommendObject.card} />
        </div>
      </div>
    </div>

  );
}

RecommendPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};
