import R from "ramda";
import React from "react";
import { useSelector } from "react-redux";
import Item from "_molecules/Item";

export default function TestPage() {
  const { itemCache } = useSelector(R.pick(["itemCache"]));
  console.log("TestPage: itemCache = ", itemCache);
  const render = Object.keys(itemCache).map((key) => (
    <Item item={itemCache[key]} />
  ));
  return <div>{render}</div>;
}
