import React from 'react';
import { useParams } from 'react-router';
import { getItemByUserId } from '_frontend/api/item';

import { Tabs } from '@mui/material';
import { Tab } from '@mui/material';
import { Box } from '@mui/material';

import TabPanel from '_molecules/TabPanel';
import Card from '_molecules/Card';

function CreateCardArray(cardArray) {
  return cardArray.map((elem) => {
    const { _id } = elem;
    return <Card Id={_id} />;
  });
}

// Todo
// Item을 어떻게 받아올지 알아내고 적용
export default function WrittenCards({ cardArray }) {
  const [tabNumber, setTabNumber] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  const { id } = useParams();
  const itemArray = getItemByUserId(Id);

  return (
    <Box className="tabs-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabNumber}
          onChange={handleChange}
          TabIndicatorProps={{ style: { background: 'black' } }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="작성한 서랍" />
          <Tab label="작성한 문서" />
          <Tab label="작성한 카드" />
        </Tabs>
      </Box>
      <TabPanel value={tabNumber} index={0}>
        <div className="tabpanel">
          {CreateCardArray(itemArray.filter((item) => item.type === "cabinet"))}
        </div>
      </TabPanel>
      <TabPanel value={tabNumber} index={1}>
        <div className="tabpanel">
          {CreateCardArray(itemArray.filter((item) => item.type === "document"))}
        </div>
      </TabPanel>
      <TabPanel value={tabNumber} index={2}>
        <div className="tabpanel">
          {CreateCardArray(itemArray.filter((item) => item.type === "card"))}
        </div>
      </TabPanel>
    </Box>
  );
}
