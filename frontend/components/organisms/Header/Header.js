import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import SearchIcon from '_assets/svgs/search_icon.svg';
import BellIcon from '_assets/svgs/bell.svg';
import CustomButton from '_atoms/CustomButton';

export default function Header() {
  const history = useHistory();
  const [value, setValue] = useState('');
  const searchInput = useRef();

  const onChange = (event) => {
    setValue(event.target.value);
  };
  const routePath = (event) => {
    if (event.keyCode === 13) {
      history.push(`/search/${value}`);
      setValue('');
    }
  };
  return (
    <div className="header">
      <div className="search-bar">
        <form>
          <img src={SearchIcon} alt="input-icon" />
          <input placeholder="검색..." type="text" form="myform" value={value} onChange={onChange} ref={searchInput} onKeyDown={routePath} />
        </form>
      </div>
      <div>
        <CustomButton imgSrc={BellIcon} />
      </div>
    </div>
  );
}

Header.propTypes = {
  setSearchString: PropTypes.func.isRequired,
};
