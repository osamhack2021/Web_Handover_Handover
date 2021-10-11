import React, { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';

import { PromiseGroupArray } from '_utils/promiseArray';
import Duplicate from '_assets/svgs/duplicate.svg';
import CustomButton from '_atoms/CustomButton';
import CustomSelect from '../CustomSelect';

function CreateMenuItemArray(groupObjectArray) {
  const returnArray = [];
  const nameArray = groupObjectArray.map((elem) => elem.name);
  for (let i = 0; i < groupObjectArray.length; i++) {
    const innerString = nameArray.slice(0, i + 1).join('>');
    const value = groupObjectArray[i].Id;
    returnArray.push({ value, innerString });
  }
  return returnArray;
}

export default function CardDropdown({
  accessGroups,
  groupObjectArray,
  onChangePermission,
  permissionId,
}) {
  const { group } = useSelector(R.pick(['group']));
  const groupIdArray = group.path.split(',').filter((elem) => elem !== '');

  // create an array of {value : , string : } in which its
  // value is used for value in MenuIten
  // string is used for inner string in MenuItem
  const menuItemArray = CreateMenuItemArray(groupObjectArray);

  // setting anchors of dropdown
  const [anchor1, setAnchor1] = useState(null);
  const openParent = Boolean(anchor1);
  const idParent = openParent ? 'simple-popover' : undefined;
  const handleClickParent = (event) => {
    setAnchor1(event.currentTarget);
  };
  const handleCloseParent = () => {
    setAnchor1(null);
  };

  return (
    <div>
      <CustomButton imgSrc={Duplicate} alt="duplicate" type="button" onClick={handleClickParent} />
      <Popover
        id={idParent}
        open={openParent}
        anchorEl={anchor1}
        onClose={handleCloseParent}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List component="nav" aria-label="mailbox folders">
          <ListItem button>
            <ListItemText primary="삭제" />
          </ListItem>
          <Divider />
          <ListItem button divider>
            <ListItemText primary="복제" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="내용 수정" />
          </ListItem>
          <Divider />
          <ListItem button>
            <CustomSelect
              menuItemArray={menuItemArray}
              permissionId={permissionId}
              onChangePermission={onChangePermission}
            />
          </ListItem>
          <Divider light />
        </List>
      </Popover>
    </div>
  );
}

CardDropdown.propTypes = {
  accessGroups: PropTypes.array.isRequired,
};
