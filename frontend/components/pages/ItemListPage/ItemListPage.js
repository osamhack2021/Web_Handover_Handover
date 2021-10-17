import { Container, Stack } from '@mui/material';
import R from 'ramda';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import TypeIcon from '_atoms/TypeIcon';
import Item from '_molecules/Item';
import { attemptGetItem } from '_thunks/item';

const ItemList = ({ items, title, iconType }) => (
  <div className="item-list">
    <div className="item-list-header">
      <TypeIcon type={iconType} size={1.5} opacity={0.7} />
      <div className="item-list-title">{title}</div>
    </div>
    <Stack direction="row" className="item-list-content" spacing={2}>
      {items != null ? (
        items.length > 0 ? (
          items.map((item) => <Item key={item._id} item={item} />)
        ) : (
          <div>표시할 항목이 없습니다.</div>
        )
      ) : (
        <div>Loading...</div>
      )}
    </Stack>
  </div>
);

export default function ItemListPage() {
  const { user } = useSelector(R.pick(['user']));
  const { itemCache } = useSelector(R.pick(['itemCache']));

  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [items, setItems] = useState(null);
  const { pathname } = useLocation();

  const addItem = (item) => {
    console.log('adding item', item, 'previous item', items);
    const currentItems = items != null ? items : [];
    setItems([...currentItems, item]);
  };

  useEffect(() => {
    let array = [];
    switch (pathname) {
      case '/bookmarks':
        setTitle('북마크');
        array = user.bookmarks;
        break;
      case '/recents':
        setTitle('최근에 본 문서');
        const localStorageRecents = JSON.parse(localStorage.getItem('recents'));
        array = localStorageRecents != null ? localStorageRecents : [];
        break;
      case '/drafts':
        setTitle('임시저장한 문서');
        array = Object.keys(itemCache).map((itemId) => itemCache[itemId]).filter(
          (item) => item.owner._id === user._id && item.status === 'draft',
        );
        break;
      default:
        array = [];
    }

    const cachedItems = [];

    array.forEach((itemId) => {
      if (itemCache.hasOwnProperty(itemId)) {
        cachedItems.push(itemCache[itemId]);
      } else {
        dispatch(attemptGetItem(itemId)).then((item) => addItem(item));
      }
    });

    setItems(cachedItems);
  }, [pathname, user]);

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
