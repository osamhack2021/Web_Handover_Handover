import {
  mdiCodeBraces,
  mdiCodeBracesBox, mdiFormatBold, mdiFormatClear, mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  // mdiFormatHeader4,
  // mdiFormatHeader5,
  // mdiFormatHeader6,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatQuoteClose, mdiRedo, mdiUndo
} from "@mdi/js";
import Icon from "@mdi/react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import React from "react";
import "_styles/editor.scss";

const VerticalDivider = () => (
  <Divider orientation="vertical" sx={{ mx: 0.5 }} />
);

const MenuButton = ({ icon, size = 32, ...props }) => (
  <Button
    size="small"
    sx={{
      ...props.sx,
      minWidth: 0,
      width: size,
      height: size,
      height: "100%",
    }}
    {...props}
  >
    <Icon path={icon} size={1} />
  </Button>
);

const StyleMenuButton = ({
  onClick,
  activeOn = null,
  isEnabled = true,
  icon,
  editor,
  ...props
}) => {
  const isActive =
    activeOn == null
      ? false
      : typeof activeOn === "string"
      ? editor.isActive(activeOn) // e.g. editor.isActive("code")
      : editor.isActive(activeOn[0], activeOn[1]); // e.g. editor.isActive("heading", { level: 1 })
  return (
    <MenuButton
      onClick={onClick}
      size="small"
      disabled={!isEnabled}
      sx={{
        minWidth: 0,
        backgroundColor: isActive ? "#0002" : "transparent",
      }}
      editor={editor}
      icon={icon}
      {...props}
    />
  );
};

export default function MenuBar({ editor, size = 42, ...props }) {
  if (!editor) {
    return null;
  }

  // Used with showing and hiding H4 ~ H6 style buttons on hover
  // const [isHeadingOptionsOpen, setHeadingOptionsOpen] = useState(false);

  // Menu is modified from: https://github.com/ueberdosis/tiptap/blob/main/demos/src/Examples/Default/React/index.jsx

  return (
    <Stack direction="row" spacing={0.25} sx={{ ...props.sx, height: size }} divider={<VerticalDivider/>}>
      <Stack direction="row" spacing={0.25} sx={{ p: 0.5 }}>
        <StyleMenuButton
          onClick={() => editor.chain().focus().undo().run()}
          isEnabled={editor.can().undo()}
          icon={mdiUndo}
          editor={editor}
        />
        <StyleMenuButton
          onClick={() => editor.chain().focus().redo().run()}
          isEnabled={editor.can().redo()}
          icon={mdiRedo}
          editor={editor}
        />
      </Stack>
      <Stack direction="row" spacing={0.25} sx={{ p: 0.5 }}>
        {[
          { level: 1, icon: mdiFormatHeader1 },
          { level: 2, icon: mdiFormatHeader2 },
          { level: 3, icon: mdiFormatHeader3 },
        ].map((e) => (
          <StyleMenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: e.level }).run()
            }
            activeOn={["heading", { level: e.level }]}
            icon={e.icon}
            editor={editor}
            key={e.level}
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={0.25} sx={{ p: 0.5 }}>
        <StyleMenuButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          icon={mdiFormatClear}
          editor={editor}
        />
        <StyleMenuButton
          onClick={() => editor.chain().focus().toggleBold().run}
          activeOn="bold"
          icon={mdiFormatBold}
          editor={editor}
        />
      </Stack>
      <Stack direction="row" spacing={0.25} sx={{ p: 0.5 }}>
        <StyleMenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={mdiFormatListBulleted}
          activeOn="bulletList"
          editor={editor}
        />
        <StyleMenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={mdiFormatListNumbered}
          activeOn="orderedList"
          editor={editor}
        />
      </Stack>
      <Stack direction="row" spacing={0.25} sx={{ p: 0.5 }}>
        <StyleMenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={mdiFormatQuoteClose}
          activeOn="blockquote"
          editor={editor}
        />
        <StyleMenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          icon={mdiCodeBraces}
          activeOn="code"
          editor={editor}
        />
        <StyleMenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          icon={mdiCodeBracesBox}
          activeOn="codeBlock"
          editor={editor}
        />
      </Stack>
      {/* H4 ~ H6 style buttons, unused as they won't be used often by all users. 
            Pro users can use Markdown heading syntaxes with #. */}
      {/* <MenuButton
          icon={mdiChevronDoubleRight}
          onMouseEnter={() => setHeadingOptionsOpen(true)}
          onMouseLeave={() => setHeadingOptionsOpen(false)}
        />
        <div
          style={{
            overflow: "hidden",
            WebkitTransition: "0.5s",
            transition: "0.5s",
            width: `${isHeadingOptionsOpen ? "auto" : "0"}`,
            height: 32,
          }}
          onMouseEnter={() => setHeadingOptionsOpen(true)}
          onMouseLeave={() => setHeadingOptionsOpen(false)}
        >
          {[
            { level: 4, icon: mdiFormatHeader4 },
            { level: 5, icon: mdiFormatHeader5 },
            { level: 6, icon: mdiFormatHeader6 },
          ].map((e) => (
            <StyleMenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: e.level }).run()
              }
              activeOn={["heading", { level: e.level }]}
              icon={e.icon}
              editor={editor}
              key={e.level}
            />
          ))}
        </div> */}
    </Stack>
  );
}

// Code below is an attempt to create a dropdown to select and set node style.
// Couldn't complete because of a strange issue that the whole Editor component
// infinitely re-renders itself when the dropdown is expanded.
// Replaced with inline buttons extending with hover action for now.

// const getStyle = (editor) => {
//   // currently selected node
//   const path = editor.view.state.selection.$anchor.path;
//
//   // Node.type of the selection
//   // [path.length - 3] because path contains all nodes from `doc` to
//   // current node, containing 2 offset values in between.
//   // `path` is structured like below.
//   // path: [RootNode, 0, 3, Node, 3, 4, ..., Node, 0, 2]
//   //                                         ^^^^ This node is the last
//   //                                              in path, which equals
//   //                                              to the selected node.
//   const selectionType = path[path.length - 3].type;
//
//   return (
//     selectionType.name +
//     (selectionType.defaultAttrs.level ? selectionType.defaultAttrs.level : "")
//   );
// };
//
// // Array of styles appliable from StyleDropdown
// const styles = [
//   { type: "paragraph", text: "본문", style: { textSize: "0.75em" } },
//   { type: "heading1", text: "제목 1", style: { textSize: "2em" } },
//   { type: "heading2", text: "제목 2", style: { textSize: "1.8em" } },
//   { type: "heading3", text: "제목 3", style: { textSize: "1.6em" } },
//   { type: "heading4", text: "제목 4", style: { textSize: "1.4em" } },
//   { type: "heading5", text: "제목 5", style: { textSize: "1.2em" } },
//   { type: "heading6", text: "제목 6", style: { textSize: "1em" } },
//   { type: "codeBlock", text: "코드 블럭", style: { fontFamily: "monospaced" } },
// ];
//
// const applyStyle = (style, editor) => {
//   if (style === "paragraph") {
//     editor.chain().focus().setParagraph().run();
//     return;
//   }
//   if (style.startsWith("heading")) {
//     editor
//       .chain()
//       .focus()
//       .toggleHeading({ level: Number(style[7]) })
//       .run();
//     return;
//   }
//   if (style === "codeBlock") {
//     editor.chain().focus().toggleCodeBlock().run();
//     return;
//   }
// };
//
// const StyleDropdown = ({ currentStyle, applyStyle }) => {
//   const handleChange = (event) => {
//     const selectedValue = event.target.value;
//     console.log("selected " + selectedValue);
//     // if (currentStyle !== selectedValue) applyStyle();
//   };
//
//   return (
//     <Select
//       value={currentStyle}
//       onChange={(e) => handleChange(e)}
//       input={<OutlinedInput />}
//     >
//       {styles.map((style) => (
//         <MenuItem key={style.type} value={style.type} sx={style.style}>
//           {style.text}
//         </MenuItem>
//       ))}
//     </Select>
//   );
// };
//
// const MemoizedStyleDropdown = React.memo(StyleDropdown, (prev, next) => {
//   return prev.currentStyle === next.currentStyle;
// });
