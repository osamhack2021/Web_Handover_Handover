import { Box, Container, LinearProgress, Tab, Tabs } from "@mui/material";
import React from "react";
import Card from "_molecules/Card";
import TabPanel from "_molecules/TabPanel";

const CardGrid = ({ cards }) => {
  if (cards == null || cards.length == 0) {
    return <div>작성한 항목이 없습니다.</div>;
  }

  return (
    <Container
      component={Container}
      maxWidth="md"
      minWidth="sm"
      sx={{
        pt: 4,
        ml: 6,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "12px"
      }}
    >
      {cards.map((e) => (
        <Card id={e._id} />
      ))}
    </Container>
  );
};

function CreateCardArray(cardArray) {
  return cardArray.map((elem) => {
    const { _id } = elem;
    return <Card id={_id} />;
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
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 8 }}>
        <Tabs
          value={tabNumber}
          onChange={handleChange}
          // TabIndicatorProps={{ style: { background: "black" } }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="작성한 서랍" />
          <Tab label="작성한 문서" />
          <Tab label="작성한 카드" />
        </Tabs>
      </Box>
      <TabPanel value={tabNumber} index={0}>
        <CardGrid cards={userItem.filter((item) => item.type === "cabinet")} />
      </TabPanel>
      <TabPanel value={tabNumber} index={1}>
        <CardGrid cards={userItem.filter((item) => item.type === "document")} />
      </TabPanel>
      <TabPanel value={tabNumber} index={2}>
        <CardGrid cards={userItem.filter((item) => item.type === "card")} />
      </TabPanel>
    </Box>
  );
}
