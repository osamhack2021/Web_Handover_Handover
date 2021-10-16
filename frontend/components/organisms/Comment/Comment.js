import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import { getUser } from '_api/user';

export default function Comment({ commentObject }) {
  // decomposes comment Object
  const {
    content, by, isEdited, date,
  } = commentObject;
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (by !== undefined) {
      getUser(by).then((data) => {
        setUser(data);
        setLoading(false);
      });
    }
  }, []);
  return !loading && (
    <Stack direction="row">
      <img
        alt="profile_image"
        style={{
          width: '36px',
          height: '36px',
          marginRight: '12px',
          borderRadius: '50%',
        }}
        src={user.profileImageUrl || '/images/default-profile.png'}
      />
      <Card
        sx={{
          maxWidth: 'md',
        }}
      >
        <CardHeader
          title={user.name}
          subheader={date}
        />
        {content}
      </Card>
    </Stack>

  );
}

Comment.propTypes = {
  commentObject: PropTypes.shape({
    content: PropTypes.string,
    by: PropTypes.string,
    isEdited: PropTypes.bool,
    date: PropTypes.string,
  }).isRequired,
};
