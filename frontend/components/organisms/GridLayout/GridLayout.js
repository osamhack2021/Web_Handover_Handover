import React from 'react';
import PropTypes from 'prop-types';

import Card from '_molecules/Card';

function CreateCardArray(cardArray) {
  return cardArray.map((elem) => {
    return (
      <Card item={elem}/>
    );
  });
}

export default function GridLayout({ cardArray }) {
  return (
    <div className="grid-layout">
      {CreateCardArray(cardArray)}
    </div>
  );
}

GridLayout.propTypes = {
  cardArray: PropTypes.array.isRequired,
};
