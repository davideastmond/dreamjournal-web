import Splash from "../../scenes/Splash";
import {
  screen,
  render,
  fireEvent,
  waitFor,
} from "../../utils/test-utils/test-utils";
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import LoginModal from "./LoginModal";
import axios from "axios";
jest.mock("axios");

describe("login modal tests", () => {
  afterEach(() => {
    jest.resetAllMocks();
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
      "Enter a password that is at least 8 characters long"
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
    (axios as any).mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: {
          token: "mockToken",
          issued: 12345,
          expires: 12345,
        },
      });
    });
    fireEvent.click(goButton);
    await waitFor(() => expect(spy).toHaveBeenCalled());
  });
});
