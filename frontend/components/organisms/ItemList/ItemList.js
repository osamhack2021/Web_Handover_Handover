import { Stack } from "@mui/material";
import React from "react";
import HorizontalScroll from 'react-scroll-horizontal';
import TypeIcon from "_atoms/TypeIcon";
import Item from "_molecules/Item";

export default function ItemList({ items, title, icon, iconType }) {
  return (
    <div className="item-list">
      <div className="item-list-header">
        {iconType != null || icon != null ? (
          <TypeIcon type={iconType} path={icon} size={1.5} opacity={0.7} />
        ) : null}
        {title && <div className="item-list-title">{title}</div>}
      </div>
      <HorizontalScroll className="item-list-scroll">
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
      </HorizontalScroll>
    </div>
  );
}
