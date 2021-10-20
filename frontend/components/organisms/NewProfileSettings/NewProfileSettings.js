import React from 'react';
import { Dialog, Tabs, Tab } from '@mui/material';

export function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function NewProfileSettings({ open }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Dialog open={open}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
      >
        <Tab label="Item One" {...a11yProps(0)} />

      </Tabs>
    </Dialog>
  );
}
