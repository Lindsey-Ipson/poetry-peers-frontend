import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

beforeAll(() => {
  global.import.meta = { env: { VITE_API_URL: 'http://localhost:3001' } };
});

it("renders without crashing", function() {
  render(<App />);
});
