import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { KoreProvider } from "@/store/koreStore";
import Meals from "@/pages/app/Meals";

function renderMeals() {
  return render(
    <MemoryRouter>
      <KoreProvider>
        <Meals />
      </KoreProvider>
    </MemoryRouter>
  );
}

describe("Meals food search", () => {
  it("finds Moi Moi when searched exactly", async () => {
    renderMeals();
    // open picker for breakfast
    fireEvent.click(screen.getAllByText(/\+ Add/i)[0]);
    const input = await screen.findByPlaceholderText(/jollof/i);
    fireEvent.change(input, { target: { value: "Moi Moi" } });
    expect(await screen.findByText("Moi Moi")).toBeTruthy();
  });

  it("finds moi moi case-insensitively and without space", async () => {
    renderMeals();
    fireEvent.click(screen.getAllByText(/\+ Add/i)[0]);
    const input = await screen.findByPlaceholderText(/jollof/i);
    fireEvent.change(input, { target: { value: "moimoi" } });
    expect(await screen.findByText("Moi Moi")).toBeTruthy();
  });

  it("finds Moi Moi via 'moin moin' spelling", async () => {
    renderMeals();
    fireEvent.click(screen.getAllByText(/\+ Add/i)[0]);
    const input = await screen.findByPlaceholderText(/jollof/i);
    fireEvent.change(input, { target: { value: "moin moin" } });
    expect(await screen.findByText("Moi Moi")).toBeTruthy();
  });

  it("finds Eba via alias", async () => {
    renderMeals();
    fireEvent.click(screen.getAllByText(/\+ Add/i)[0]);
    const input = await screen.findByPlaceholderText(/jollof/i);
    fireEvent.change(input, { target: { value: "eba" } });
    expect(await screen.findByText(/Garri/)).toBeTruthy();
  });

  it("shows Add button after entering weight", async () => {
    renderMeals();
    fireEvent.click(screen.getAllByText(/\+ Add/i)[0]);
    const input = await screen.findByPlaceholderText(/jollof/i);
    fireEvent.change(input, { target: { value: "Moi Moi" } });
    fireEvent.click(await screen.findByText("Moi Moi"));
    const gramsInput = await screen.findByPlaceholderText("0");
    fireEvent.change(gramsInput, { target: { value: "300" } });
    const addBtn = await screen.findByText("Add to log");
    expect(addBtn).toBeTruthy();
  });
});
