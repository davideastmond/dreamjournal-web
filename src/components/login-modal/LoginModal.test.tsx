import Splash from "../../scenes/Splash";
import {
  screen,
  render,
  fireEvent,
  waitFor,
} from "../../utils/test-utils/test-utils";
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { API_URL } from "../../environment";

import LoginModal from "./LoginModal";

const server = setupServer(
  rest.post(`${API_URL}/api/auth/login`, (_, res, context) => {
    return res(
      context.json({
        token: "mockToken",
        issued: 12345,
        expires: 12345,
      })
    );
  })
);

const serverWithErrorResponse = setupServer(
  rest.post(`${API_URL}/api/auth/login`, (_, res) => {
    return res((response) => {
      response.status = 401;
      response.body = {
        error:
          "Authentication error: please check the email address and password combination.",
      };
      return response;
    });
  })
);
afterEach(() => {
  jest.resetAllMocks();
});

describe("login modal error response tests", () => {
  beforeAll(() => {
    serverWithErrorResponse.listen();
  });
  afterEach(() => {
    serverWithErrorResponse.resetHandlers();
  });
  afterAll(() => {
    serverWithErrorResponse.close();
  });
  test("error message displays when HTTP request fails", async () => {
    const spy = jest.fn();
    render(
      <BrowserRouter>
        <LoginModal
          open={true}
          onDismiss={() => null}
          onSuccessfulLogin={spy}
        />
      </BrowserRouter>
    );
    const emailTextInputElement = screen.getByLabelText(/email/i);
    const passwordTextInputElement = screen.getByLabelText(/password/i);

    fireEvent.change(emailTextInputElement, {
      target: { value: "email@example.com" },
    });
    fireEvent.change(passwordTextInputElement, {
      target: { value: "password123" },
    });
    const goButton = screen.getByRole("button", { name: "Go" });
    fireEvent.click(goButton);
    await waitFor(() => {
      const serverResponseError = screen.getByText(/Authentication error/i);
      expect(serverResponseError).toBeInTheDocument();
    });
  });
});
describe("login modal tests", () => {
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  test("validation error messages display", () => {
    render(
      <Router>
        <Splash />
      </Router>
    );
    const signInButtonElement = screen.getByRole("button", { name: "Sign in" });
    fireEvent.click(signInButtonElement);

    const goButton = screen.getByRole("button", { name: "Go" });
    fireEvent.click(goButton);

    const emailValidationError = screen.getByText(
      "Please enter a valid e-mail address"
    );
    const passwordValidationError = screen.getByText(
      "Please enter a password that is at least 8 characters long"
    );
    expect(emailValidationError).toBeInTheDocument();
    expect(passwordValidationError).toBeInTheDocument();
  });
  test("go button clicked triggers API call", async () => {
    const spy = jest.fn();
    render(
      <BrowserRouter>
        <LoginModal
          open={true}
          onDismiss={() => null}
          onSuccessfulLogin={spy}
        />
      </BrowserRouter>
    );
    const emailTextInputElement = screen.getByLabelText(/email/i);
    const passwordTextInputElement = screen.getByLabelText(/password/i);

    fireEvent.change(emailTextInputElement, {
      target: { value: "email@example.com" },
    });
    fireEvent.change(passwordTextInputElement, {
      target: { value: "password123" },
    });
    const goButton = screen.getByRole("button", { name: "Go" });
    fireEvent.click(goButton);
    await waitFor(() => expect(spy).toHaveBeenCalled());
  });
});
