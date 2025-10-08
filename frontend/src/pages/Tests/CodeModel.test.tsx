import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CodeModel from "../CodeModel";
import Cookies from "js-cookie";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

describe("CodeModel Page", () => {
  test("should render the category view by default", () => {
    render(
      <MemoryRouter>
        <CodeModel />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: "Python" })).toBeInTheDocument();
    expect(screen.getByText("Categorias")).toHaveClass("bg-primary/10");
    expect(
      screen.getByPlaceholderText("Buscar categorias...")
    ).toBeInTheDocument();
  });

  test("should switch to tree view when the button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CodeModel />
      </MemoryRouter>
    );

    const treeViewButton = screen.getByRole("button", {
      name: "Árvore Interativa",
    });
    await user.click(treeViewButton);

    expect(screen.getByText("Árvore Interativa")).toHaveClass("bg-primary/10");
    expect(
      screen.getByText("Navegação em Árvore Interativa")
    ).toBeInTheDocument();
    expect(Cookies.set).toHaveBeenCalledWith("codeModelViewMode", "tree", {
      expires: 365,
    });
  });

  test("should change language when a new language is selected", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CodeModel />
      </MemoryRouter>
    );

    const javaButton = screen.getByRole("button", { name: "Java" });
    await user.click(javaButton);

    expect(screen.getByRole("heading", { name: "Java" })).toBeInTheDocument();
    expect(Cookies.set).toHaveBeenCalledWith("language", "Java", {
      expires: 1,
    });
  });
});
