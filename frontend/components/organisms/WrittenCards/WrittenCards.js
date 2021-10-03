import React from 'react';
import { Tabs } from '@material-ui/core';
import { Tab } from '@material-ui/core';
import { Box } from '@material-ui/core';

import Button from "react-bulma-companion/lib/Button";

import TabPanel from '_molecules/TabPanel';
import ItemSelect from '_molecules/ItemSelect';
import FormInput from '_molecules/FormInput';

export default function WrittenCards() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const dummyitems = [
    {
      _id: 1,
      value: 'a',
    },
    {
      _id: 2,
      value: 'b',
    },
    {
      _id: 3,
      value: 'c',
    },
    {
      _id: 4,
      value: 'd',
    },
  ];

  return (
    <Box className="tabs-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{style: {background:'black'}}} variant="fullWidth" >
          <Tab label="작성한 서랍" />
          <Tab label="작성한 문서" />
          <Tab label="작성한 카드" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} className="tabpanel">
        작성한 서랍
      </TabPanel>
      <TabPanel value={value} index={1} className="tabpanel">
        작성한 문서
      </TabPanel>
      <TabPanel value={value} index={2} className="tabpanel">
        작성한 카드
      </TabPanel>
    </Box>
  );
}