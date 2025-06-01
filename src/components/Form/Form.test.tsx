/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Form } from "./Form";
import { entriesStore } from "../../EntriesStore";

window.fetch = vi.fn();

vi.mock("../../EntriesStore", () => ({
  entriesStore: {
    entries: [
      {
        id: "1",
        title: "Test Game",
        publisher: "Test Publisher",
        developer: "Test Developer",
        criticsScore: "85",
        playersScore: "8.0",
      },
    ],
    addEntries: vi.fn(),
  },
}));

describe("Form Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form fields correctly", () => {
    render(<Form />);

    expect(screen.getByLabelText(/title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publisher:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/developer:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/criticsScore:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/playersScore:/i)).toBeInTheDocument();
  });

  it("submits form data and resets inputs", async () => {
    const user = userEvent.setup();

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "123",
        title: "New Game",
        publisher: "New Publisher",
        developer: "New Developer",
        criticsScore: "90",
        playersScore: "9.0",
      }),
    });

    render(<Form />);

    expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();

    await user.type(screen.getByLabelText(/title:/i), "New Game");
    await user.type(screen.getByLabelText(/publisher:/i), "New Publisher");
    await user.type(screen.getByLabelText(/developer:/i), "New Developer");
    await user.type(screen.getByLabelText(/criticsScore:/i), "90");
    await user.type(screen.getByLabelText(/playersScore:/i), "9.0");

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByRole("button", { name: /submitting\.\.\./i })).toBeDisabled();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/chunk10/games",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining('"title":"New Game"'),
        })
      );

      expect(entriesStore.addEntries).toHaveBeenCalledWith([
        {
          id: "123",
          title: "New Game",
          publisher: "New Publisher",
          developer: "New Developer",
          criticsScore: "90",
          playersScore: "9.0",
        },
      ]);
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/title:/i)).toHaveValue("");
      expect(screen.getByLabelText(/publisher:/i)).toHaveValue("");
      expect(screen.getByLabelText(/developer:/i)).toHaveValue("");
      expect(screen.getByLabelText(/criticsScore:/i)).toHaveValue("");
      expect(screen.getByLabelText(/playersScore:/i)).toHaveValue("");
    });
  });

  it("handles submission failure gracefully", async () => {
    const user = userEvent.setup();

    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    render(<Form />);

    await user.type(screen.getByLabelText(/title:/i), "New Game");
    await user.type(screen.getByLabelText(/publisher:/i), "New Publisher");
    await user.type(screen.getByLabelText(/developer:/i), "New Developer");
    await user.type(screen.getByLabelText(/criticsScore:/i), "90");
    await user.type(screen.getByLabelText(/playersScore:/i), "9.0");

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/chunk10/games",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining('"title":"New Game"'),
        })
      );

      expect(entriesStore.addEntries).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();
    });
  });
});