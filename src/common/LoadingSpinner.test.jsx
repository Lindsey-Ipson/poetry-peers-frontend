import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders without crashing", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the spinner", () => {
    render(<LoadingSpinner />);
    const spinnerElement = screen.getByRole("spinner");
    expect(spinnerElement).toBeInTheDocument();
  });
  
});
