import React from "react";
import Container from '@mui/material/Container';
import Editor from "_frontend/components/molecules/Editor";

export default function EditorPage() {
  return (
    <div>
      <Container maxWidth="md">
        <Editor />
      </Container>
    </div>
  );
}
