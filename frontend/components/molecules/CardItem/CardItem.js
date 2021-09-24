import React from 'react';
import PropTypes from 'prop-types';

export default function CardItem({ value }) {
  const { title } = value;
  return (
    <div className="child">
      {title}
    </div>
  );
}

CardItem.propTypes = {
  value: PropTypes.object.isRequired,
};
