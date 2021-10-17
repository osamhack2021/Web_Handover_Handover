import { Stack } from "@mui/material";
import React from "react";
import Item from "_molecules/Item";
import ItemListHeader from "_molecules/ItemListHeader";

export default function ItemList({ items, title, icon, iconType }) {
  return (
    <div className="item-list">
      <ItemListHeader title={title} icon={icon} iconType={iconType} />
      <div className="item-list-scroll">
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
    </div>
  );
}
