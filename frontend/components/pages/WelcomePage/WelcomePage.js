import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import R from "ramda";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

export default function WelcomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(["user"]));

  useEffect(() => {
    if (!R.isEmpty(user)) {
      dispatch(push("/home"));
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ height: "100%" }}>
      <Stack>
        Landing Page
      </Stack>
    </Container>
  );
}
