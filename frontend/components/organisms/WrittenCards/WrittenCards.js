import React from "react";
import LinearProgress from '@mui/material/LinearProgress';

import { Tabs } from "@mui/material";
import { Tab } from "@mui/material";
import { Box } from "@mui/material";

import TabPanel from "_molecules/TabPanel";
import Card from "_molecules/Card";

function CreateCardArray(cardArray) {
  return cardArray.map((elem) => {
    const { _id } = elem;
    return <Card Id={_id} />;
  });
}

export default function WrittenCards({ userItem }) {
  const [tabNumber, setTabNumber] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  return userItem == null ? (
    <LinearProgress />
  ) : userItem.length == 0 ? (
    <div>작성한 항목이 없습니다.</div>
  ) : (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabNumber}
          onChange={handleChange}
          TabIndicatorProps={{ style: { background: "black" } }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="작성한 서랍" />
          <Tab label="작성한 문서" />
          <Tab label="작성한 카드" />
        </Tabs>
      </Box>
      <TabPanel value={tabNumber} index={0}>
          {CreateCardArray(userItem.filter((item) => item.type === "cabinet"))}
      </TabPanel>
      <TabPanel value={tabNumber} index={1}>
          {CreateCardArray(userItem.filter((item) => item.type === "document"))}
      </TabPanel>
      <TabPanel value={tabNumber} index={2}>
          {CreateCardArray(userItem.filter((item) => item.type === "card"))}
      </TabPanel>
    </Box>
  );
}
