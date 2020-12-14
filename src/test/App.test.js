import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";

import store from "../store/";
import App from "../components/App";

it("renders an option to view categories", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByText("Categories")).toBeInTheDocument();
});
