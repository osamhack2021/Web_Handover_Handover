import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import React from 'react';

function RoleCreator(string) {
  console.log(string.split(','));
  return string.split(',').map((elem) => {
    let color = '';
    switch (elem) {
      case 'Frontend':
        color = '#257942';
        break;
      case 'Backend':
        color = '#0e75b9';
        break;
      case 'Design':
        color = '#947600';
        break;
      case 'Leader':
        color = '#db002c';
        break;
      default:
        color = '#595959';
    }
    console.log(color);
    return (
      <span style={{ color }}>
        {elem}
        {' '}
        {' '}
      </span>
    );
  });
}

export default function TeamProfile({
  imgSrc, name, roles, army, status,
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
        alt="profileImg"
        className="profile-image"
        style={{
          width: '80px',
          height: '80px',
          marginLeft: '50px',
          marginRight: '10px',
          borderRadius: '50%',
        }}
        src={imgSrc || '/images/profile-default.jpg'}
      />
      <Stack sx={{ marginLeft: '20px' }}>
        <Typography sx={{
          fontFamily: 'BM HANNA_TTF',
          fontStyle: 'normal',
          fontWeight: '400',
          fontSize: '22px',
        }}
        >
          {name}
        </Typography>
        <Typography sx={{
          fontFamily: 'BM HANNA_TTF',
          fontStyle: 'bold',
          fontWeight: '400',
          fontSize: '16px',
        }}
        >
          <Stack direction="row" spacing={1}>
            {RoleCreator(roles)}
          </Stack>
        </Typography>
        <Typography sx={{
          fontFamily: 'BM HANNA_TTF',
          fontStyle: 'normal',
          fontWeight: '400',
          fontSize: '16px',
        }}
        >
          {army}
        </Typography>
        <Typography sx={{
          fontFamily: 'BM HANNA_TTF',
          fontStyle: 'normal',
          fontWeight: '400',
          fontSize: '14px',
          color: '#9999',
        }}
        >
          {status}
        </Typography>
      </Stack>

      {/* <CardHeader
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
      /> */}
    </Card>
  );
}

TeamProfile.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
