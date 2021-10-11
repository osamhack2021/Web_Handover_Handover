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
  console.log('CustomSelect');
  console.log(menuItemArray);
  console.log(permissionId);
  console.log(onChangePermission);
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
  menuItemArray: PropTypes.arrayOf(Object).isRequired,
  onChangePermission: PropTypes.func.isRequired,
  permissionId: PropTypes.string.isRequired,
};
