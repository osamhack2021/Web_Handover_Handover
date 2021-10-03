import React from 'react';
import PropTypes from 'prop-types';

import Card from '_molecules/Card';

function CreateCardArray(cardArray) {
  return cardArray.map((elem) => {
    const {
      type, title, description, content, Id,
    } = elem;
    return (
      <Card
        type={type}
        title={title}
        description={description}
        isArchived={false}
        content={content}
        Id={Id}
      />
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
