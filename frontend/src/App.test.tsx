import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import store, { persistor } from "./store/store";

test("renders learn react link", () => {
    render(<App store={store} persistor={persistor} />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
