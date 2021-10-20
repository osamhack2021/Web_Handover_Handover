import { mdiBell } from '@mdi/js';
import Icon from '@mdi/react';
import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SearchIcon from '_assets/svgs/search_icon.svg';

export default function Header() {
  const history = useHistory();
  const [value, setValue] = useState('');
  const searchInput = useRef();

  const onChange = (event) => {
    setValue(event.target.value);
  };
  const routePath = (event) => {
    if (
      event.keyCode === 13
      && history.location.pathname !== `/search/${value}`
    ) {
      history.push(`/search/${value}`);
      setValue('');
    }
  };
  return (
    <div className="header" style={{ height: 'fit-content', paddingTop: '7px', paddingBottom: '7px' }}>
      <div className="search-bar">
        <form style={{ width: '100%' }}>
          <img src={SearchIcon} alt="input-icon" />
          <input
            placeholder="검색..."
            type="text"
            form="myform"
            value={value}
            onChange={onChange}
            ref={searchInput}
            onKeyDown={routePath}
          />
        </form>
      </div>
      <IconButton className="header-notification-button">
        <Icon size={1} path={mdiBell} />
      </IconButton>
    </div>
  );
}

Header.propTypes = {
  setSearchString: PropTypes.func.isRequired,
};
