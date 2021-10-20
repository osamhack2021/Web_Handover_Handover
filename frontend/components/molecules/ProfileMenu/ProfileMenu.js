import {
  mdiAccount, mdiCog, mdiLogoutVariant, mdiMenuDown,
} from '@mdi/js';
import Icon from '@mdi/react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import R from 'ramda';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LinkComponent from '_atoms/LinkComponent';
import NewProfileSettings from '_frontend/components/organisms/NewProfileSettings';
import { attemptLogout } from '_thunks/auth';

export default function ProfileMenu() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  const [profileOpen, setProfileOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    // Click on <ButtonBase> targets <Stack> element
    // Sets anchor to bottom right of the <Stack> element
    setAnchorEl(event.currentTarget.childNodes[0]);
  };
  const handleClose = () => {
    setAnchorEl(null);
    // setProfileOpen(false);
  };

  const handleProfileOpen = () => {
    setProfileOpen(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ButtonBase
        onClick={handleClick}
        sx={{ width: '100%', py: '16px', px: '24px' }}
        className="profile-menu"
      >
        <Stack direction="row" sx={{ alignItems: 'center', width: '100%' }}>
          <img
            className="profile-image"
            style={{
              width: '36px',
              height: '36px',
              marginRight: '12px',
              borderRadius: '50%',
            }}
            src={user.profileImageUrl || '/images/profile-default.jpg'}
          />
          <div
            style={{
              flexGrow: 1,
              fontSize: '1.4em',
              fontWeight: 700,
              textAlign: 'start',
              paddingTop: '1px',
            }}
          >
            {user.rank}
            {' '}
            {user.name}
          </div>
          <Icon path={mdiMenuDown} size={1} />
        </Stack>
      </ButtonBase>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            ml: '7px',
            mt: 0.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={LinkComponent} to="/account">
          <ListItemIcon>
            <Icon path={mdiAccount} size={1} />
          </ListItemIcon>
          내 프로필
        </MenuItem>
        <MenuItem component={LinkComponent} to="/account/settings">
          <ListItemIcon>
            <Icon path={mdiCog} size={1} />
          </ListItemIcon>
          계정 설정
        </MenuItem>
        <NewProfileSettings open={profileOpen} />
        <MenuItem onClick={() => dispatch(attemptLogout()).catch(R.identity)}>
          <ListItemIcon>
            <Icon path={mdiLogoutVariant} size={1} />
          </ListItemIcon>
          로그아웃
        </MenuItem>
      </Menu>
    </Box>
  );
}
