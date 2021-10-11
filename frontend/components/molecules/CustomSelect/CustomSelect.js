import React, { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { PromiseGroupArray } from '_utils/promiseArray';
import PropTypes from 'prop-types';

function CreateComponentArray(menuItemArray) {
  return menuItemArray.map((elem) => <MenuItem value={elem.value}>{elem.innerString}</MenuItem>);
}

// path Array is of form [{}, {}, {Item Object} ...]
export default function CustomSelect({ menuItemArray, permissionId, onChangePermission }) {
  const menuComponentArray = CreateComponentArray(menuItemArray);
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel>접근 권한 설정</InputLabel>
      <Select
        value={permissionId}
        onChange={onChangePermission}
      >
        {menuComponentArray}
      </Select>
    </FormControl>
  );
}

CustomSelect.propTypes = {
  groupIdArray: PropTypes.array.isRequired,
  indexRead: PropTypes.number.isRequired,
};
