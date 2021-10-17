import { Stack } from "@mui/material";
import React from "react";
import TypeIcon from "_atoms/TypeIcon";
import Item from "_molecules/Item";

export default function ItemList({ items, title, iconType }) {
  return (
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
}
