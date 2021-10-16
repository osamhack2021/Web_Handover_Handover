import { Container, Stack, Tooltip } from "@mui/material";
import R from "ramda";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import TypeIcon from "_atoms/TypeIcon";
import Breadcrumbs from "_molecules/Breadcrumbs";
import Editor from "_molecules/Editor";
import Comment from "_organisms/Comment";
import { attemptGetItem, attemptGetItemChildren } from "_thunks/item";
import { deepEqual } from "_utils/compare";

const hierarchyLevel = {
  cabinet: 1,
  document: 2,
  card: 3,
};

export default function ItemPage() {
  // Item id from URL params: /item/:itemId
  const { itemId } = useParams();

  // find current user from store
  const { user } = useSelector(R.pick(["user"]));
  const dispatch = useDispatch();

  // Read more about useSelector() hook here:
  // https://react-redux.js.org/api/hooks#useselector
  const cachedItem = useSelector((state) => state.itemCache[itemId]);

  // will try to use cachedItem if not null (= if exists in cache)
  const [item, setItem] = useState(cachedItem);
  const [itemChildren, setItemChildren] = useState(null);
  const [itemParents, setItemParents] = useState(null);
  const [isBookmarked, setBookmarked] = useState(
    user.bookmarks.includes(itemId)
  );
  // visibility of the component; used on delete and unauthorized items
  const [visible, setVisible] = useState(true);

  // creates [currentItemId, parentItemId, parentParentItemId] array
  const pathArray =
    item != null
      ? item.path
          .split(",")
          .filter((e) => e !== "") // remove surrounding empty strings
          .reverse()
      : [];
  const cachedParent = useSelector(
    (state) => state.itemCache[pathArray.length > 1 ? pathArray[1] : null]
  );
  const cachedParentParent = useSelector(
    (state) => state.itemCache[pathArray.length > 2 ? pathArray[2] : null]
  );

  // DEBUG
  if (cachedItem == null) console.log(itemId + " wasn't found in itemCache.");
  else console.log(itemId + " was found in itemCache: ", cachedItem);

  const [loadingPath, setLoadingPath] = useState(true);
  const [loadingChild, setLoadingChild] = useState(true);
  const [pathObject, setPathObject] = useState({});
  const [childObject, setChildObject] = useState({});
  // const [item, setItem] = useState({});

  useEffect(() => {
    if (
      item == null ||
      !item.hasOwnProperty("accessGroups") || // item must have accessGroups property
      !item.hasOwnProperty("content") // item must have content property
    ) {
      // retrieve item and its children from API if there were no item object passed
      dispatch(attemptGetItem(itemId))
        .then((item) => {
          setItem(item);
          if (item.type !== "card") {
            dispatch(attemptGetItemChildren(item.path)).then((items) => {
              setItemChildren(items);
            });
          }
        })
        .catch(() => setVisible(false));
    } else {
      // retrieve item from server for possible updates
      dispatch(attemptGetItem(itemId))
        .then((response) => {
          if (!deepEqual(item, setItem(response))) {
            // update state deep equality between state and response is false
            console.log(
              itemId,
              " cache was updated compared to server: ",
              response
            );
            setItem(response);
          }
        })
        .catch(() => setVisible(false));

      if (item.type !== "card" && itemChildren == null) {
        dispatch(attemptGetItemChildren(item.path)).then((children) => {
          setItemChildren(children);
        });
      }
    }

    // setting recents of localstorage
    const recentArray = JSON.parse(localStorage.getItem("recents"));
    if (!recentArray.includes(itemId)) {
      if (recentArray.length > 20) {
        localStorage.setItem(
          "recents",
          JSON.stringify([...recentArray, itemId].shift())
        );
      } else {
        localStorage.setItem(
          "recents",
          JSON.stringify([...recentArray, itemId])
        );
      }
    }
  }, [itemId]);

  useEffect(() => {
    if (item != null) {
      switch (item.type) {
        case "cabinet": // will have 0 parents because it's the root item
          console.log("switch: case =", item.type, pathArray);
          setItemParents([]);
          break;
        case "document": // will have 1 parent item as cabinet
          console.log("switch: case =", item.type, pathArray);
          if (pathArray.length == 2) {
            // try item from cache
            setItemParents([cachedParent]);

            // check for document update
            dispatch(attemptGetItem(pathArray[1])).then((item) => {
              // update only if updated
              if (!deepEqual(item, cachedParent)) setItemParents([item]);
            });
          }
          break;
        case "card": // will have 2 parent items as document and cabinet
          console.log("switch: case =", item.type, pathArray);
          if (pathArray.length == 3) {
            // try item from cache
            setItemParents([cachedParentParent, cachedParent]);

            // check for document update
            dispatch(attemptGetItem(pathArray[1])).then((item) => {
              // update only if updated
              if (!deepEqual(item, cachedParent)) {
                // update to [newDocumentItem, previousCabinetItem]
                setItemParents([cachedParentParent, item]);
              }
            });

            // check for cabinet update
            dispatch(attemptGetItem(pathArray[2])).then((item) => {
              // update only if updated
              if (!deepEqual(item, cachedParentParent)) {
                // update to [previousDocumentItem, newCabinetItem]
                setItemParents([item, cachedParent]);
              }
            });
          }
      }
    }
  }, [item]);

  console.log("render; item =", item, "visible =", visible);

  return visible && item != null ? (
    // <div className="content-pane">
    // <Header />
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={1} className="item-page">
        <div className="item-header">
          <div className="item-title">{item.title}</div>
          <Tooltip title="서랍" arrow>
            <TypeIcon type={item.type} size={2} opacity={0.7} />
          </Tooltip>
        </div>
        {itemParents != null ? (
          <Breadcrumbs itemArray={[...itemParents, item]} />
        ) : (
          <Breadcrumbs hierarchyLevel={hierarchyLevel[item.type]} />
        )}
        {item.content && <Editor content={item.content} editable={false} />}
        <div>
          <div className="outer-div">
            <div className="grid-container">
              {/* <GridHeader title={item.title} pathArray={pathObject.pathArray} />
          <div className="grid-layout-container">
            <GridLayout cardArray={childObject.childArray} />
          </div> */}
            </div>
          </div>
          {item.comments &&
            item.comments.map((elem) => (
              <Comment key={item.comments.indexOf(elem)} commentObject={elem} />
            ))}
        </div>
      </Stack>
    </Container>
  ) : (
    <div>Loading...</div>
  );
}
