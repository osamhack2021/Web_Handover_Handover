import React from 'react';
import { Switch, Route } from 'react-router';

import LeftPane from '_organisms/LeftPane';
// import GridLayout from '_organisms/GridLayout';
import HomePage from '_pages/HomePage';
import RecommendPage from '_pages/RecommendPage';

export default function RoutingPage() {
  const dummyGroupData = [
    {
      _id: 1,
      name: '인사과',
      anthing: 'else is possible',
    },
    {
      _id: 2,
      name: '00대대',
    },
    {
      _id: 3,
      name: '창업동아리',
    },
  ];

  return (

    <div className="page-template">
      <div className="left-pane-container">
        <LeftPane
          name="홍길동"
          rank="하사"
          division="00부대"
          title="인사담당관"
          groupData={dummyGroupData}
        />
      </div>
      <Switch>
        {/* <Route path="/blahblahbalh" component={anything} /> */}
        <Route path="/home" component={HomePage} />
        <Route path="/recommend" component={RecommendPage} />
      </Switch>
    </div>
  );
}
