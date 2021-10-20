import React from "react";
import TypeIcon from "_atoms/TypeIcon";

export default function ItemListHeader({ title, icon, iconType, ...props }) {
  return (
    <div className="item-list-header" {...props}>
      {iconType != null || icon != null ? (
        <TypeIcon type={iconType} path={icon} size={1.5} opacity={0.7} />
      ) : null}
      {title && <div className="item-list-title">{title}</div>}
    </div>
  );
}
