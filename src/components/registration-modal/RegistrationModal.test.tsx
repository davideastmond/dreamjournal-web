import {
  screen,
  render,
  fireEvent,
  waitFor,
} from "../../utils/test-utils/test-utils";
import RegistrationModal from "./RegistrationModal";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { API_URL } from "../../environment";

const server = setupServer(
  rest.post(`${API_URL}/api/auth/register`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post(`${API_URL}/api/auth/login`, (_, res, ctx) => {
    return res(
      ctx.json({
        token: "mockToken",
        issued: 1234,
        expires: 12345,
      })
    );
  })
);

const errorResponseServer = setupServer(
  rest.post(`${API_URL}/api/auth/register`, (_, res) => {
    return res((response) => {
      response.status = 500;
      response.body = { error: "User with e-mail address already exists" };
      return response;
    });
  })
);
afterEach(() => {
  jest.resetAllMocks();
});

describe("Registration modal - error response from server tests", () => {
  beforeAll(() => {
    errorResponseServer.listen();
  });
  afterAll(() => {
    errorResponseServer.close();
  });
  afterEach(() => {
    errorResponseServer.resetHandlers();
  });
  test("registration error response shows up in the UI", async () => {
    render(
      <RegistrationModal
        open={true}
        onDismiss={() => null}
        onSuccessDismiss={() => null}
      />
    );
    const registerButtonElement = screen.getByRole("button", {
      name: /register/i,
    });

    const emailInputElement = screen.getByLabelText(/Email/i);
    const firstNameInputElement = screen.getByLabelText(/first name/i);
    const lastNameInputElement = screen.getByLabelText(/last name/i);
    const passwordInputElement = screen.getByLabelText(/enter a password/i);
    const confirmPasswordInputElement =
      screen.getByLabelText(/confirm password/i);

    fireEvent.change(emailInputElement, {
      target: { value: "test@example.com" },
    });
    fireEvent.change(firstNameInputElement, { target: { value: "firstName" } });
    fireEvent.change(lastNameInputElement, { target: { value: "lastName" } });
    fireEvent.change(passwordInputElement, {
      target: { value: "password$12345" },
    });
    fireEvent.change(confirmPasswordInputElement, {
      target: { value: "password$12345" },
    });

    fireEvent.click(registerButtonElement);
    expect(registerButtonElement).toBeDisabled();
    await waitFor(() => {
      const serverErrorResponse = screen.getByText(/User with e-mail/i);
      expect(serverErrorResponse).toBeInTheDocument();
    });
  });
});
describe("Registration Modal component tests", () => {
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  test("on dismiss callback is called when cancel button clicked", () => {
    const dismissSpy = jest.fn();
    render(
      <RegistrationModal
        open={true}
        onDismiss={dismissSpy}
        onSuccessDismiss={() => null}
      />
    );
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    expect(dismissSpy).toHaveBeenCalled();
  });
  describe("validation error messages", () => {
    test("getting error messages when clicking Register and all input boxes are empty", () => {
      render(
        <RegistrationModal
          open={true}
          onDismiss={() => null}
          onSuccessDismiss={() => null}
        />
      );
      const registerButtonElement = screen.getByRole("button", {
        name: /register/i,
      });
      fireEvent.click(registerButtonElement);
      const validationTextElements = screen.getAllByText(/Please enter/i);
      expect(validationTextElements).toHaveLength(5);
      validationTextElements.forEach((element) => {
        expect(element).toBeInTheDocument();
      });
    });
    test(`- get no validation error messages showing when registration details are completed properly
          - register button is disabled on click`, async () => {
      const successSpy = jest.fn();
      render(
        <RegistrationModal
          open={true}
          onDismiss={() => null}
          onSuccessDismiss={successSpy}
        />
      );
      const registerButtonElement = screen.getByRole("button", {
        name: /register/i,
      });

      const emailInputElement = screen.getByLabelText(/Email/i);
      const firstNameInputElement = screen.getByLabelText(/first name/i);
      const lastNameInputElement = screen.getByLabelText(/last name/i);
      const passwordInputElement = screen.getByLabelText(/enter a password/i);
      const confirmPasswordInputElement =
        screen.getByLabelText(/confirm password/i);

      fireEvent.change(emailInputElement, {
        target: { value: "test@example.com" },
      });
      fireEvent.change(firstNameInputElement, {
        target: { value: "firstName" },
      });
      fireEvent.change(lastNameInputElement, { target: { value: "lastName" } });
      fireEvent.change(passwordInputElement, {
        target: { value: "password$12345" },
      });
      fireEvent.change(confirmPasswordInputElement, {
        target: { value: "password$12345" },
      });

      fireEvent.click(registerButtonElement);
      expect(registerButtonElement).toBeDisabled();
      await waitFor(() => {
        expect(successSpy).toHaveBeenCalled();
      });
    });
  });
});
