import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import RegisterPage from "../RegisterPage";
import React from "react";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const MockAuthContext = React.createContext<any>(null);
const mockRegister = jest.fn();

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <MockAuthContext.Provider value={{ register: mockRegister }}>
    {children}
  </MockAuthContext.Provider>
);

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => React.useContext(MockAuthContext),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider>{component}</MockAuthProvider>
    </BrowserRouter>
  );
};

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render the registration form correctly", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole("heading", { name: /registrar/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome de usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /criar conta/i })).toBeInTheDocument();
  });

  it("should handle successful registration", async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ success: true });
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome de usuário/i), "newuser");
    await user.type(screen.getByLabelText(/email/i), "new@test.com");
    await user.type(screen.getByLabelText(/^senha$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirmar senha/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "newuser",
        "new@test.com",
        "Password123!"
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should show an error for a short username", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome de usuário/i), "ab");
    await user.type(screen.getByLabelText(/email/i), "test@email.com");
    await user.type(screen.getByLabelText(/^confirmar senha$/i), "Password123!");
        await user.type(screen.getByLabelText(/^senha$/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(
      await screen.findByText(/O nome de usuário deve ter pelo menos 3 caracteres/i)
    ).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should show an error for mismatching passwords", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome de usuário/i), "testuser");
    await user.type(screen.getByLabelText(/email/i), "test@email.com");
    await user.type(screen.getByLabelText(/^senha$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirmar senha/i), "WrongPassword!");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText(/as senhas não coincidem/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should display an error message on registration failure", async () => {
    const user = userEvent.setup();
    const errorMessage = "Este email já está em uso";
    mockRegister.mockRejectedValue({
      response: { data: errorMessage },
    });
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText(/nome de usuário/i), "existinguser");
    await user.type(screen.getByLabelText(/email/i), "existing@test.com");
    await user.type(screen.getByLabelText(/^senha$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirmar senha/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should show loading state on submission", async () => {
    const user = userEvent.setup();
    let resolveRegister: any;
    const registerPromise = new Promise(resolve => {
        resolveRegister = resolve;
    });
    mockRegister.mockReturnValue(registerPromise);
    renderWithProviders(<RegisterPage />);

    const submitButton = screen.getByRole("button", { name: /criar conta/i });

    await user.type(screen.getByLabelText(/nome de usuário/i), "anotheruser");
    await user.type(screen.getByLabelText(/email/i), "another@test.com");
    await user.type(screen.getByLabelText(/^senha$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirmar senha/i), "Password123!");
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /criando conta.../i })).toBeInTheDocument();

    resolveRegister({ success: true });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});