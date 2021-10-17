import { Container, Stack } from '@mui/material';
import React from 'react';
import ItemList from '_organisms/ItemList';

export default function ItemListSection({title, items}) {

  const cabinetItems = items != null ? items.filter((item) => item.type === 'cabinet') : null;
  const documentItems = items != null ? items.filter((item) => item.type === 'document') : null;
  const cardItems = items != null ? items.filter((item) => item.type === 'card') : null;

  return items != null ? (
    <Container maxWidth="md">
      <Stack spacing={1} className="item-list-page" sx={{ py: 4 }}>
        <div className="item-list-page-title">{title}</div>
        <ItemList items={cabinetItems} title="서랍" iconType="cabinet" />
        <ItemList items={documentItems} title="문서" iconType="document" />
        <ItemList items={cardItems} title="카드" iconType="card" />
      </Stack>
    </Container>
  ) : (
    <div>Loading...</div>
  );
}
