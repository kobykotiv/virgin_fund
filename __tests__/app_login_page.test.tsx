// __tests__/app_login_page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../app/login/page";
import * as nextRouter from "next/navigation";

jest.spyOn(nextRouter, "useRouter").mockImplementation(() => ({
  push: jest.fn(),
}));

jest.mock("@/providers/auth-provider", () => ({
  useAuth: () => ({
    login: jest.fn(),
    enableDemoMode: jest.fn(),
  }),
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

describe("LoginPage", () => {
  it("renders login form and UI elements", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Alpaca API Key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Alpaca Secret Key/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/or sign in with/i)).toBeInTheDocument();
    expect(screen.getByText(/Google/i)).toBeInTheDocument();
    expect(screen.getByText(/GitHub/i)).toBeInTheDocument();
    expect(screen.getByText(/Try Demo Account/i)).toBeInTheDocument();
  });

  it("shows error if fields are empty and submit is clicked", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText(/Connect Alpaca/i));
    expect(screen.getByText(/API key and Secret key are required/i)).toBeInTheDocument();
  });

  it("calls enableDemoMode when Try Demo Account is clicked", () => {
    const enableDemoMode = jest.fn();
    jest.spyOn(require("@/providers/auth-provider"), "useAuth").mockReturnValue({
      login: jest.fn(),
      enableDemoMode,
    });
    render(<LoginPage />);
    fireEvent.click(screen.getByText(/Try Demo Account/i));
    expect(enableDemoMode).toHaveBeenCalled();
  });

  it("renders disabled social sign-in buttons", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Google/i)).toBeDisabled();
    expect(screen.getByText(/GitHub/i)).toBeDisabled();
  });
});

// Summary of Changes:
// - Added tests for login page UX: forgot password, validation, demo/social sign-in, and error states.
