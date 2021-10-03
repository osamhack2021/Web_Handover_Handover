import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import listToCompnent from '_utils/listToComponent';
import PromiseItemArray from '_utils/promiseArray';
import NoteHeader from '../NoteHeader';
import NoteFooter from '../NoteFooter';
import CardItem from '../CardItem';

// type takes "card", "document", "cabinet" values
// rest of the props are self-evident

export default function Card({
  type, title, description, content, isArchived = false, Id,
}) {
  const history = useHistory();
  const [loadingChild, setLoadingChild] = useState(true);
  const [contentObject, setContentObject] = useState({});
  useEffect(() => {
    if (type === 'card') {
      setContentObject({ content });
      setLoadingChild(false);
    } else {
      PromiseItemArray(content.children, setContentObject, setLoadingChild, 'content');
    }
  }, []);
  const className = `note--${type}`;
  let processedContent;
  if (!loadingChild) {
    if (type === 'card') {
      processedContent = contentObject.content;
    } else {
      processedContent = listToCompnent(CardItem, contentObject.content, 'Id');
    }
  }
  const dateFromNow = '2주 전 수정됨';
  const routeChange = () => {
    const path = `item/${Id}`;
    history.push(path);
  };

  return !loadingChild && (
    <div className={className}>
      <div>
        {/* passing NoteHeader onClick element, so that upon clicking title can be redirected */}
        <NoteHeader title={title} isArchived={isArchived} onClick={routeChange} />
        <div className="description">
          {description}
        </div>
        <div className="container-child">
          {processedContent}
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
  content: PropTypes.object.isRequired,
  isArchived: PropTypes.bool.isRequired,
  Id: PropTypes.string.isRequired,
};
