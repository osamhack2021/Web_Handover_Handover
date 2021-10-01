import React from 'react';

import GridHeader from '_organisms/GridHeader';
import GridLayout from '_organisms/GridLayout';
import Header from '_organisms/Header';

export default function HomePage() {
  return (
    <div className="home-page">
      <Header />
      <div className="outer-div">
        <div className="grid-container">
          <GridHeader />
          <div className="grid-layout-container">
            <GridLayout />
          </div>
        </div>
      </div>
    </div>
  );
}
