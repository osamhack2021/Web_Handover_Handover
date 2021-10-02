/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useRef } from 'react';
import Card from '_molecules/Card';
import PropTypes from 'prop-types';
import HorizontalScroll from 'react-scroll-horizontal';

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
  // const recommendCards = useRef();

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

  return (
    <div className="recommend-card" ref={recommendCard}>
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
