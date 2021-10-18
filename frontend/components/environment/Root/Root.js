import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ConnectedRouter } from "connected-react-router";
import PropTypes from "prop-types";
import React from "react";
import { Provider } from "react-redux";
import Main from "_environment/Main";


const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#dd4436',
    },
    secondary: {
      main: '#E85A50',
    },
  },
});

export default function Root({ history, store }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <Main />
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
