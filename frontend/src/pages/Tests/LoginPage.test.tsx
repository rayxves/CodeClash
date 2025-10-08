import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../LoginPage";
import React from "react";

const MockAuthContext = React.createContext<any>(null);

const MockAuthProvider = ({
  children,
  mockLogin,
}: {
  children: React.ReactNode;
  mockLogin: jest.Mock;
}) => (
  <MockAuthContext.Provider value={{ login: mockLogin }}>
    {children}
  </MockAuthContext.Provider>
);

jest.mock("../../contexts/AuthContext", () => {
  const actual = jest.requireActual("../../contexts/AuthContext");
  return {
    ...actual,
    useAuth: () => React.useContext(MockAuthContext),
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

const renderWithProviders = (
  component: React.ReactElement,
  mockLogin: jest.Mock
) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider mockLogin={mockLogin}>{component}</MockAuthProvider>
    </BrowserRouter>
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render login form correctly", () => {
    renderWithProviders(<LoginPage />, jest.fn());

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Entre na sua conta")).toBeInTheDocument();
    expect(screen.getByLabelText(/nome de usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("should sanitize username correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, jest.fn());

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    await user.type(usernameInput, "user<script>");

    expect(usernameInput).toHaveValue("userscript");
  });

  it("should handle successful login", async () => {
    const user = userEvent.setup();
    const mockLogin = jest.fn().mockResolvedValue({
      id: "1",
      username: "testuser",
      token: "mock-token",
      email: "test@gmail.com",
    });

    renderWithProviders(<LoginPage />, mockLogin);

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "Password.123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser", "Password.123");
    });
  });

  it("should handle login error", async () => {
    const user = userEvent.setup();
    const errorMessage = "Credenciais inválidas";
    const mockLogin = jest.fn().mockRejectedValue({
      response: { status: 400, data: errorMessage },
    });

    renderWithProviders(<LoginPage />, mockLogin);

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "Password.123");
    await user.click(submitButton);

    await waitFor(async () => {
      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("should show loading state during login", async () => {
    const user = userEvent.setup();
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    const mockLogin = jest.fn().mockReturnValue(loginPromise);

    renderWithProviders(<LoginPage />, mockLogin);

    const usernameInput = screen.getByLabelText(/nome de usuário/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "Password.123");
    await user.click(submitButton);

    await waitFor(() => expect(submitButton).toBeDisabled());

    expect(
      screen.getByRole("button", { name: /entrando.../i })
    ).toBeInTheDocument();

    resolveLogin!({ id: 1, username: "testuser", token: "token" });

    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
});
