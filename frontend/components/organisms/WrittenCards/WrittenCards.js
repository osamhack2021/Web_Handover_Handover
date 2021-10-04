import React from 'react';
import { Tabs } from '@material-ui/core';
import { Tab } from '@material-ui/core';
import { Box } from '@material-ui/core';

import TabPanel from '_molecules/TabPanel';
import Card from '_molecules/Card';

function CreateCardArray(cardArray) {
  return cardArray.map((elem) => {
    const {
      type, title, description, content, Id,
    } = elem;
    return (
      <Card
        type={type}
        title={title}
        description={description}
        isArchived={false}
        content={content}
        Id={Id}
      />
    );
  });
}

const dummy = [{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'cabinet',
  content: {
    description: '',
    children: [],
  },
},{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'cabinet',
  content: {
    description: '',
    children: [],
  },
},{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'cabinet',
  content: {
    description: '',
    children: [],
  },
},{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'cabinet',
  content: {
    description: '',
    children: [],
  },
},{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'cabinet',
  content: {
    description: '',
    children: [],
  },
},{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'cabinet',
  content: {
    description: '',
    children: [],
  },
},{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'document',
  content: {
    description: '',
    children: [],
  },
},{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'document',
  content: {
    description: '',
    children: [],
  },
},{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'document',
  content: {
    description: '',
    children: [],
  },
},
{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'card',
  content: '안녕하세요',
},
{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'card',
  content: '안녕하세요',
},{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'card',
  content: '안녕하세요',
},{
  _id: '6156d6413334eb865afc2d7b',
  title: 'Handover',
  type: 'card',
  content: '안녕하세요',
},
];

export default function WrittenCards({ cardArray }) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box className="tabs-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{ style: { background: 'black' } }} variant="fullWidth" >
          <Tab label="작성한 서랍" />
          <Tab label="작성한 문서" />
          <Tab label="작성한 카드" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className="tabpanel">
          {CreateCardArray(dummy.slice(0, 6))}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="tabpanel">
          {CreateCardArray(dummy.slice(6, 9))}
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="tabpanel">
          {CreateCardArray(dummy.slice(9, 12))}
        </div>
      </TabPanel>
    </Box>
  );
}
