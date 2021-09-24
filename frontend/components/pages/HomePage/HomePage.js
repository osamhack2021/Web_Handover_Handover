import React from 'react';

import GridHeader from '_organisms/GridHeader';
import GridLayout from '_organisms/GridLayout';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="grid-container">
        <GridHeader />
        <div className="grid-layout-container">
          <GridLayout />
        </div>
      </div>
    </div>
  );
}
