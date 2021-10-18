import React from "react";
import ReactDOM from "react-dom";

import history from "_frontend/history";
import store from "_frontend/store";

import Root from "./Root";

describe("Root Component", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(<Root history={history} store={store} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
