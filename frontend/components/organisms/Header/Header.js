import React from 'react';
import PropTypes from 'prop-types';

import SearchIcon from '_assets/svgs/search_icon.svg';
import BellIcon from '_assets/svgs/bell.svg';
import CustomButton from '_atoms/CustomButton';

export default function Header() {
  // onSubmit, onClick function required
  // const onSubmit;
  // const onClick;
  return (
    <div className="header">
      <div className="search-bar">
        <form>
          <img src={SearchIcon} alt="input-icon" />
          <input placeholder="검색..." type="text" form="myform" />
        </form>
      </div>
      <div>
        <CustomButton imgSrc={BellIcon} />
      </div>
    </div>
  );
}

// Header.propTypes = {
//   onSubmit: PropTypes.func.isRequired,
//   onClick: PropTypes.func.isRequired,
// };
