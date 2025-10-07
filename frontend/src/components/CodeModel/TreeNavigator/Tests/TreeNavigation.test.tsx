import { render, screen } from "@testing-library/react";
import * as useTreeNavigatorHook from "../../../../hooks/useTreeNavigator";
import TreeNavigator from "../TreeNavigator";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../../hooks/useTreeNavigator");

const mockUseTreeNavigator = useTreeNavigatorHook.useTreeNavigator as jest.Mock;

describe("TreeNavigator Page", () => {
  test("should display a loading spinner while isLoading is true", () => {
    mockUseTreeNavigator.mockReturnValue({
      isLoading: true,
      language: "Python",
      notifications: [],
    });

    render(<TreeNavigator />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText(/python/i)).not.toBeInTheDocument();
  });

  test("should render the main content when loading is complete", () => {
    mockUseTreeNavigator.mockReturnValue({
      isLoading: false,
      language: "Python",
      navigationMode: "depth",
      notifications: [],
      selectedNode: { id: "1", name: "Root" },
      setNavigationMode: jest.fn(),
    });

    render(
      <MemoryRouter>
        <TreeNavigator />
      </MemoryRouter>
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText(/python/i)).toBeInTheDocument();
    expect(screen.getByText("Profundidade")).toBeInTheDocument();
  });
});
