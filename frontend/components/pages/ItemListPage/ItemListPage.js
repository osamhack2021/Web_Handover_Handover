import R from "ramda";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import ItemListSection from "_frontend/components/templates/ItemListSection";
import { attemptGetItem } from "_thunks/item";

export default function ItemListPage() {
  const { user } = useSelector(R.pick(["user"]));
  const { itemCache } = useSelector(R.pick(["itemCache"]));

  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [items, setItems] = useState(null);
  const { pathname } = useLocation();

  const addItem = (item) => {
    console.log("adding item", item, "previous item", items);
    const currentItems = items != null ? items : [];
    setItems([...currentItems, item]);
  };

  useEffect(() => {
    let array = [];
    switch (pathname) {
      case "/bookmarks":
        setTitle("북마크");
        array = user.bookmarks;
        break;
      case "/recents":
        setTitle("최근에 본 문서");
        const localStorageRecents = JSON.parse(localStorage.getItem("recents"));
        array = localStorageRecents != null ? localStorageRecents : [];
        break;
      case "/drafts":
        setTitle("임시저장한 문서");
        array = Object.keys(itemCache)
          .map((itemId) => itemCache[itemId])
          .filter(
            (item) => item.owner._id === user._id && item.status === "draft"
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

  return <ItemListSection title={title} items={items} />;
}
