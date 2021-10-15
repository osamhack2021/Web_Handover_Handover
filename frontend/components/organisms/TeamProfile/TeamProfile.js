import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

export default function TeamProfile({
  imgSrc, name, description,
}) {
  return (
    <Card
      sx={{
        width: '400px',
        height: '180px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <img
        alt="team_profile_image"
        style={{
          width: '80px',
          height: '80px',
          marginLeft: '18px',
          marginRight: '10px',
          borderRadius: '50%',
        }}
        src={imgSrc || '/images/default-profile.png'}
      />
      <CardHeader
        title={(
          <Typography sx={{
            fontFamily: 'BM HANNA_TTF',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '30px',
          }}
          >
            {name}
          </Typography>
        )}
        subheader={(
          <Typography sx={{
            fontFamily: 'BM HANNA_TTF',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '23px',
          }}
          >
            {description}
          </Typography>
        )}
      />
    </Card>
  );
}

TeamProfile.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
