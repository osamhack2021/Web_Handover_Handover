import React from 'react';
import PropTypes from 'prop-types';

export default function CustomButton({
  imgSrc, className = '', onClick, alt, type,
}) {
  if (className === '' && type === '') {
    return (
      <button type={type} onClick={onClick}>
        <img src={imgSrc} alt={alt} />
      </button>
    );
  }
  return (
    <button type={type} onClick={onClick} className={className}>
      <img src={imgSrc} alt={alt} />
    </button>
  );
}

CustomButton.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  alt: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
