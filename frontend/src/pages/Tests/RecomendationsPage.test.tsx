import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RecommendationsPage from "../RecomendationsPage";
import {
  getCodeReferenceByFilters,
  recommendSimilar,
} from "../../api/codeReferenceServices";

jest.mock("../../api/codeReferenceServices", () => ({
  getCodeReferenceByFilters: jest.fn(),
  recommendSimilar: jest.fn(),
}));

const mockGetCodeReferenceByFilters = getCodeReferenceByFilters as jest.Mock;
const mockRecommendSimilar = recommendSimilar as jest.Mock;

const renderWithRouter = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/recommendations/:language/:name"
          element={<RecommendationsPage />}
        />
        <Route
          path="/recommendations/code/:code"
          element={<RecommendationsPage />}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe("RecommendationsPage", () => {
  test("should show loading screen initially", () => {
    mockGetCodeReferenceByFilters.mockResolvedValueOnce([]);
    renderWithRouter("/recommendations/Python/Bubble%20Sort");
    expect(screen.getByText(/Buscando recomendações.../i)).toBeInTheDocument();
  });

  test("should show no code screen if no source code is found", async () => {
    mockGetCodeReferenceByFilters.mockResolvedValueOnce([]);
    renderWithRouter("/recommendations/Python/NonExistent");

    expect(
      await screen.findByText("Nenhum código encontrado para analisar")
    ).toBeInTheDocument();
  });

  test("should display recommendations based on language and name params", async () => {
    const modelCode = {
      id: "1",
      name: "Bubble Sort",
      code: "def bubble_sort(): pass",
    };
    const recommendations = [
      { id: "2", name: "Insertion Sort", code: "def insertion_sort(): pass" },
    ];

    mockGetCodeReferenceByFilters.mockResolvedValue([modelCode]);
    mockRecommendSimilar.mockResolvedValue(recommendations);

    renderWithRouter("/recommendations/Python/Bubble%20Sort");

    expect(await screen.findByText("Insertion Sort")).toBeInTheDocument();
    expect(screen.getByText("Código modelo analisado")).toBeInTheDocument();
  });

  test("should display recommendations based on code param", async () => {
    const userCode = "print('hello world')";
    const recommendations = [
      { id: "3", name: "Hello World in C++", code: "cout << 'hello'" },
    ];

    mockRecommendSimilar.mockResolvedValue(recommendations);

    renderWithRouter(`/recommendations/code/${encodeURIComponent(userCode)}`);

    expect(await screen.findByText("Hello World in C++")).toBeInTheDocument();
    expect(screen.getByText("Seu código analisado")).toBeInTheDocument();
  });
});
