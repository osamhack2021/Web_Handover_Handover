import React from 'react';
import PropTypes from 'prop-types';

import Card from '_molecules/Card';

export default function GridLayout({ cardArray }) {
  return (
    <div className="grid-layout">
      <Card isArchived={true} />
      <Card />
      <Card />
      <Card isArchived={true} />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
      <Card />
    </div>
  );
}

GridLayout.propTypes = {
  cardArray: PropTypes.array.isRequired,
};
