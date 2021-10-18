import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import EditorMenuBar from "_frontend/components/molecules/EditorMenuBar";

export default function Editor({
  content = null,
  onContentChange = null,
  editable = true,
  ...props
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    editable: editable,
    content:
      content != null
        ? content
        : `
        <h2>
          Hi there,
        </h2>
        <p>
          this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
        <pre><code class="language-css">body {
    display: none;
  }</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that’s amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `,
  });

  useEffect(() => {
    if (editor != null) {
      // Read more: https://tiptap.dev/api/commands/set-content
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (onContentChange != null && editor != null)
    onContentChange(editor.getHTML()); // TODO: Resolve https://reactjs.org/link/setstate-in-render warning

  return editable ? (
    <Stack
      spacing={0.5}
      sx={{ border: "2px solid #0003", borderRadius: 2 }}
      {...props}
    >
      <Stack sx={{ mb: 1 }}>
        <EditorMenuBar editor={editor} sx={{ px: 1 }} />
        <Divider flexItem />
      </Stack>
      {editor && (
        <BubbleMenu
          className="bubble-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            굵게
          </button>
          {/* <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          Strike
        </button> */}
        </BubbleMenu>
      )}
      {editor && (
        <FloatingMenu
          className="floating-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          {/* TODO: Change to icons instead of text buttons */}
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            <span style={{ fontSize: "1rem", fontWeight: 900 }}>제목 1</span>
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>제목 2</span>
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
          >
            <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>제목 3</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
          >
            순서있는 목록
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            순서없는 목록
          </button>
        </FloatingMenu>
      )}
      <Box sx={{ p: 2 }}>
        <EditorContent editor={editor} />
      </Box>
    </Stack>
  ) : (
    <EditorContent editor={editor} />
  );
}

// Card.propTypes = {
//   type: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   content: PropTypes.object.isRequired,
//   isArchived: PropTypes.bool.isRequired,
//   Id: PropTypes.string.isRequired,
// };
