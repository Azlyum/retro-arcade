import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import BugSquash from "./bugSquash";

describe("BugSquash", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("counts a hit when the player starts pressing before the bug disappears", () => {
    render(<BugSquash />);

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /initialize/i }));
    });

    const buttons = screen.getAllByRole("button");
    const firstHoleButton = buttons[1];

    fireEvent.pointerDown(firstHoleButton);

    act(() => {
      jest.advanceTimersByTime(701);
    });

    fireEvent.click(firstHoleButton);

    expect(screen.getByTestId("score-value").textContent).toBe("1");
  });
});
