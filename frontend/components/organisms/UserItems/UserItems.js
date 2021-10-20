import {
  Box, Container, LinearProgress, Tab, Tabs, Divider,
} from '@mui/material';
import React from 'react';
import Item from '_molecules/Item';
import TabPanel from '_molecules/TabPanel';

const CardGrid = ({ cards }) => {
  if (cards == null || cards.length == 0) {
    return <div>작성한 항목이 없습니다.</div>;
  }

  return (
    <Container
      component={Container}
      maxWidth="md"
      sx={{
        pt: 4,
        ml: 6,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {cards.map((e) => (
        <Item id={e._id} />
      ))}
    </Container>
  );
};

function CreateCardArray(cardArray) {
  return cardArray.map((elem) => {
    const { _id } = elem;
    return <Item id={_id} />;
  });
}

export default function UserItems({ userItem }) {
  const [tabNumber, setTabNumber] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTabNumber(newValue);
  };

  return userItem == null ? (
    <LinearProgress />
  ) : (
    <Box>
      <Tabs
        value={tabNumber}
        onChange={handleChange}
          // TabIndicatorProps={{ style: { background: "black" } }}
        variant="fullWidth"
      >
        <Tab label="작성한 서랍" />
        <Tab label="작성한 문서" />
        <Tab label="작성한 카드" />
      </Tabs>
      <Divider />
      <TabPanel value={tabNumber} index={0}>
        <CardGrid cards={userItem.filter((item) => item.type === 'cabinet')} />
      </TabPanel>
      <TabPanel value={tabNumber} index={1}>
        <CardGrid cards={userItem.filter((item) => item.type === 'document')} />
      </TabPanel>
      <TabPanel value={tabNumber} index={2}>
        <CardGrid cards={userItem.filter((item) => item.type === 'card')} />
      </TabPanel>
    </Box>
  );
}
