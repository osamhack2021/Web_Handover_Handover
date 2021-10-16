import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import Editor from "_frontend/components/molecules/Editor";

export default function EditorPage({ itemId }) {
  const [title, setTitle] = useState("");
  const [path, setPath] = useState("");
  const [content, setContent] = useState(null);

  const handleChange = (e) => setTitle(e.target.value);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={1}>
        <TextField
          fullWidth
          id="card-title"
          label="제목"
          variant="outlined"
          value={title}
          onChange={handleChange}
        />
        <Editor onContentChange={(html) => setContent(html)} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => alert(content)}
        >
          카드 게시
        </Button>
      </Stack>
    </Container>
  );
}
