import React from 'react';

import RecommendHeader from '_organisms/RecommendHeader';
import RecommendContent from '_organisms/RecommendContent';
import Header from '_organisms/Header';

export default function RecommendPage() {
  return (
    <div className="recommend-page">
      <Header />
      <div className="recommend-page-header">
        추천 양식
      </div>
      <div className="recommend-container">
        <div className="recommend-block">
          <RecommendHeader type="cabinet" />
          <hr />
          <RecommendContent type="cabinet" />
        </div>
        <div className="recommend-block">
          <RecommendHeader type="document" />
          <hr />
          <RecommendContent type="document" />
        </div>
        <div className="recommend-block">
          <RecommendHeader type="card" />
          <hr />
          <RecommendContent type="card" />
        </div>
      </div>
    </div>

  );
}
