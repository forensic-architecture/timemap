import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SatelliteOverlayToggle from "../SatelliteOverlayToggle";
import "@testing-library/jest-dom";

describe("<SatelliteOverlayToggle />", () => {
  it("shows the option to switch to satellite by default", () => {
    render(
      <SatelliteOverlayToggle reset={jest.fn()} switchToSatellite={jest.fn()} />
    );
    expect(screen.getByRole("button", { name: /sat/i })).toBeTruthy();
  });

  it("shows the option to switch to map when satellite is selected", () => {
    render(
      <SatelliteOverlayToggle
        isUsingSatellite
        reset={jest.fn()}
        switchToSatellite={jest.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /map/i })).toBeTruthy();
  });

  it("calls the toggle function when clicked", () => {
    const toggle = jest.fn();
    render(<SatelliteOverlayToggle isUsingSatellite toggleView={toggle} />);
    const btn = screen.getByRole("button", { name: /map/i });
    fireEvent.click(btn);
    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
