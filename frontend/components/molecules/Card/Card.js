import React from 'react';
import PropTypes from 'prop-types';

import NoteHeader from '../NoteHeader';
import NoteFooter from '../NoteFooter';
import CardItem from '../CardItem';

import listToCompnent from '../../../utils/listToComponent';

// type takes "card", "document", "cabinet" values
// rest of the props are self-evident

export default function Card({ type = 'card', title, description, children, isArchived = false }) {
  // const mainTitle = item.title;
  // const description = item.content.description;
  // const children = item.content.children;

  const className = `note--${type}`;
  const dummyTitle = '물품 관리';
  const dummyDescription = '대위 이순신';
  const dummyChildren = [
    {
      _id: 1,
      title: '문서 제목 1',
    },
    {
      _id: 2,
      title: '문서 제목 2',
    },
    {
      _id: 3,
      title: '문서 제목 3',
    },
  ];

  const dummyIsArchived = true;
  const arrayRender = listToCompnent(CardItem, dummyChildren, '_id');
  const dateFromNow = '2주 전 수정됨';

  return (
    <div className={className}>
      <div>
        <NoteHeader title={dummyTitle} isArchived={isArchived} />
        <div className="description">
          {dummyDescription}
        </div>
        <div className="container-child">
          {arrayRender}
        </div>
      </div>
      <NoteFooter dateFromNow={dateFromNow} />
    </div>
  );
}

Card.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  isArchived: PropTypes.bool.isRequired,
};
