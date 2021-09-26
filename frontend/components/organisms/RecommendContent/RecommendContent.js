/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Card from '_molecules/Card';
import PropTypes from 'prop-types';

function ArrayToComponent(type, cardArray) {
  return (cardArray.map(
    (elem) => (
      <Card
        type={type}
        description={elem.description}
        children={elem.children}
        isArchived={elem.isArchived}
      />
    ),
  )
  );
}

export default function RecommendContent({ type, cardArray }) {
  // const arrCard = ArrayToComponent(type, cardArray);
  return (
    <div className="recommend-card">
      <Card type={type} />
      <Card type={type} />
      <Card type={type} />
      <Card type={type} />
    </div>
  );
}

RecommendContent.propTypes = {
  type: PropTypes.string.isRequired,
  cardArray: PropTypes.arrayOf(PropTypes.object).isRequired,
};
