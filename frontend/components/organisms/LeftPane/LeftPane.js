import { ButtonBase } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import R from 'ramda';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LinkComponent from '_atoms/LinkComponent';
import Logo from '_frontend/components/atoms/Logo';
import { attemptGetUserItem } from '_frontend/store/thunks/item';
import MenuItem from '_molecules/MenuItem';
import ProfileMenu from '_molecules/ProfileMenu';
import { store as RNC } from 'react-notifications-component';

const dummy = [
  {
    Id: 1,
    title: '군수과',
    type: 'cabinet',
  },
  {
    Id: 2,
    title: '00대대',
    type: 'cabinet',
  },
];

function arrayToMenuItems(array) {
  return array.map((elem, index) => (
    <ListItem disableGutters sx={{ py: 0 }} key={index}>
      <ListItemButton disableGutters sx={{ py: 0 }}>
        <MenuItem
          key={elem.Id}
          value={{ title: elem.title, Id: elem._id, link: `/item/${elem._id}` }}
        />
      </ListItemButton>
    </ListItem>
  ));
}

export default function LeftPane() {
  const dispatch = useDispatch();
  // if user exists, means a user has logged in, i.e. item, group items are available
  const { user } = useSelector(R.pick(['user']));
  const { group } = useSelector(R.pick(['group']));

  const [myCabinet, setMyCabinet] = useState([]);
  const [loadingCabinet, setLoadingCabinet] = useState(true);

  useEffect(() => {
    dispatch(attemptGetUserItem(user._id))
      .catch(() => {
        setLoadingCabinet(false);
        RNC.addNotification({
          title: '서버 오류',
          type: 'error',
          message: '내 서랍을 서버로부터 불러오지 못했습니다.',
          container: 'top-center',
          animationIn: ['animated', 'fadeInRight'],
          animationOut: ['animated', 'fadeOutRight'],
          dismiss: {
            duration: 5000,
          },
        });
      })
      .then((data) => {
        console.log('useritem');
        console.log(data);
        setMyCabinet(data.filter((elem) => (elem.type === 'cabinet')));
        setLoadingCabinet(false);
      });
  }, []);

  return !loadingCabinet && (
    <div className="leftpane">
      <ButtonBase
        component={LinkComponent}
        to="/home"
        className="leftpane-logo-button"
      >
        <Logo />
      </ButtonBase>
      <div className="leftpane-header">
        <ProfileMenu
          name={user.name}
          rank={user.rank}
          title={user.title}
          division={group.name}
        />
      </div>
      <div className="leftpane-menu">
        <div className="leftpane-menu1">
          <ListSubheader className="leftpane-label"> 내 서랍 </ListSubheader>
          {arrayToMenuItems(myCabinet)}
        </div>
        <div className="leftpane-menu2">
          <ListSubheader className="leftpane-label"> 내 문서 </ListSubheader>
          <ListItem disableGutters sx={{ py: 0 }}>
            <ListItemButton disableGutters sx={{ py: 0 }}>
              <MenuItem value={{ title: '북마크', link: '/bookmarks' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters sx={{ py: 0 }}>
            <ListItemButton disableGutters sx={{ py: 0 }}>
              <MenuItem value={{ title: '최근에 본 항목', link: '/recents' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters sx={{ py: 0 }}>
            <ListItemButton disableGutters sx={{ py: 0 }}>
              <MenuItem
                value={{ title: '내가 작성한 문서', link: '/account/items' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters sx={{ py: 0 }}>
            <ListItemButton disableGutters sx={{ py: 0 }}>
              <MenuItem value={{ title: '임시저장한 항목', link: '/drafts' }} />
            </ListItemButton>
          </ListItem>
        </div>
        <div className="leftpane-menu3">
          <ListSubheader className="leftpane-label"> 기타 </ListSubheader>
          <ListItem disableGutters sx={{ py: 0 }}>
            <ListItemButton disableGutters sx={{ py: 0 }}>
              <MenuItem value={{ title: '설정', link: '/setting' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters sx={{ py: 0 }}>
            <ListItemButton disableGutters sx={{ py: 0 }}>
              <MenuItem value={{ title: '도움말', link: '/' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters sx={{ py: 0 }}>
            <ListItemButton disableGutters sx={{ py: 0 }}>
              <MenuItem value={{ title: '서비스 페이지', link: '/' }} />
            </ListItemButton>
          </ListItem>
        </div>
      </div>
    </div>
  );
}
