/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useRef, useState } from 'react';
import Card from '_molecules/Card';
import PropTypes from 'prop-types';

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

export default function HorizontalContent({ cardArray }) {
  const recommendCard = useRef();
  // eslint-disable-next-line consistent-return
  useEffect(() => {
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
  }, []);
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
