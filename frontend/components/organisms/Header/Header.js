import { mdiBell, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SearchIcon from '_assets/svgs/search_icon.svg';
import LinkComponent from '_atoms/LinkComponent';

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
      <Button
        disableElevation
        variant="contained"
        color="primary"
        component={LinkComponent}
        to="/item/create"
      >
        <Icon
          path={mdiPlus}
          size={0.9}
          style={{ marginLeft: "-6px", marginRight: "4px" }}
        />
        새로 만들기
      </Button>
    </div>
  );
}

Header.propTypes = {
  setSearchString: PropTypes.func.isRequired,
};
