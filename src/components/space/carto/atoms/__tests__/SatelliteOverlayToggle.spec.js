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

  it("shows the option to switch to map when satellite selected", () => {
    render(
      <SatelliteOverlayToggle
        isUsingSatellite
        reset={jest.fn()}
        switchToSatellite={jest.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /map/i })).toBeTruthy();
  });

  it("calls the reset function when switching to the default overlay", () => {
    const mockReset = jest.fn();
    const mockSat = jest.fn();
    render(
      <SatelliteOverlayToggle
        isUsingSatellite
        reset={mockReset}
        switchToSatellite={mockSat}
      />
    );
    const btn = screen.getByRole("button", { name: /map/i });
    fireEvent.click(btn);
    expect(mockReset).toHaveBeenCalledTimes(1);
    expect(mockSat).not.toHaveBeenCalled();
  });

  it("calls the switchToSatellite function when switching to the satellite overlay", () => {
    const mockReset = jest.fn();
    const mockSat = jest.fn();
    render(
      <SatelliteOverlayToggle reset={mockReset} switchToSatellite={mockSat} />
    );
    const btn = screen.getByRole("button", { name: /sat/i });
    fireEvent.click(btn);
    expect(mockSat).toHaveBeenCalledTimes(1);
    expect(mockReset).not.toHaveBeenCalled();
  });
});
