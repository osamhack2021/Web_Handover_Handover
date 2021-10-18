import {
  mdiFileCabinet,
  mdiFileDocumentOutline,
  mdiTextBoxOutline
} from "@mdi/js";
import { Icon } from "@mdi/react";
import React from "react";

const icon = {
  cabinet: mdiFileCabinet,
  document: mdiFileDocumentOutline,
  card: mdiTextBoxOutline,
};

export default function TypeIcon({ type, path, ...props }) {
  const isString = typeof type === "string";
  return isString ? (
    <Icon path={icon[type]} {...props} />
  ) : (
    <Icon path={path} {...props} />
  );
}
