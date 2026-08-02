import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { App } from "@/App";

function renderWithProviders(initialPath = "/login") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("App routing", () => {
  it("renders the login page at /login", () => {
    renderWithProviders("/login");
    expect(screen.getByRole("button", { name: /войти/i })).toBeInTheDocument();
  });

  it("renders the register page at /register", () => {
    renderWithProviders("/register");
    expect(screen.getByRole("button", { name: /создать аккаунт/i })).toBeInTheDocument();
  });

  it("redirects unauthenticated users away from /dashboard", () => {
    renderWithProviders("/dashboard");
    // No token in localStorage in this test env, so RequireAuth should
    // bounce straight to /login without ever mounting the dashboard.
    expect(screen.getByRole("button", { name: /войти/i })).toBeInTheDocument();
  });
});
