/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useRef, useState } from 'react';
import Card from '_molecules/Card';
import PropTypes from 'prop-types';

function CreateCardArray(cardArray) {
  return cardArray.map((elem) => {
    return (
      <Card item={elem} />
    );
  });
}

export default function HorizontalContent({ cardArray }) {
  const recommendCard = useRef();
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    console.log(`loading with cardArray ${cardArray}`);
    const container = recommendCard.current;
    if (container) {
      const onWheel = (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        container.scrollTo({
          left: container.scrollLeft + e.deltaY,
          behavior: 'smooth',
        });
      };
      container.addEventListener('wheel', onWheel);
      return () => container.removeEventListener('wheel', onWheel);
    }
  }, [cardArray]);
  // type = 'card', title, description, children, isArchived = false
  return (
    <div className="recommend-card" ref={recommendCard}>
      {CreateCardArray(cardArray)}
    </div>
  );
}

HorizontalContent.propTypes = {
  cardArray: PropTypes.arrayOf(PropTypes.object).isRequired,
};
