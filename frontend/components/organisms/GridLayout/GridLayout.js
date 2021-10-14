import PropTypes from 'prop-types';
import React from 'react';
import Item from '_molecules/Item';


function CreateCardArray(cardArray) {
  return cardArray.map((elem) => {
    return (
      <Item item={elem}/>
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
