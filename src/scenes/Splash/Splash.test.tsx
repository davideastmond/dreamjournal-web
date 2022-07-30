import { screen, render, fireEvent } from "../../utils/test-utils/test-utils";
import Splash from "./Splash";
import { BrowserRouter as Router } from "react-router-dom";

describe("App splash screen tests - render in document", () => {
  test("app logo is rendered on Splash screen", () => {
    render(
      <Router>
        <Splash />
      </Router>
    );
    const appLogoElement = screen.getByRole("img");
    expect(appLogoElement).toBeInTheDocument();
  });

  test("sign in button is rendered on Splash screen", () => {
    render(
      <Router>
        <Splash />
      </Router>
    );
    const signInButtonElement = screen.getByRole("button", { name: "Sign in" });
    expect(signInButtonElement).toBeInTheDocument();
  });
  test("new account button is rendered on Splash screen", () => {
    render(
      <Router>
        <Splash />
      </Router>
    );
    const newAccountButtonElement = screen.getByRole("button", {
      name: "New account",
    });
    expect(newAccountButtonElement).toBeInTheDocument();
  });
});

describe("App splash screen tests", () => {
  test("clicking sign in button loads the sign in modal. Clicking 'cancel' causes the dialog to hide", () => {
    render(
      <Router>
        <Splash />
      </Router>
    );
    const signInButtonElement = screen.getByRole("button", { name: "Sign in" });
    fireEvent.click(signInButtonElement);
    const signInDialog = screen.getByRole("dialog", { name: "Sign In" });
    expect(signInDialog).toBeInTheDocument();
    const signInModalCancelButton = screen.getByRole("button", {
      name: "Cancel",
    });
    fireEvent.click(signInModalCancelButton);
    expect(signInDialog).not.toBeInTheDocument();
  });
  test("clicking off the dialog should hide the sign in dialog", () => {
    render(
      <Router>
        <Splash />
      </Router>
    );
    const signInButtonElement = screen.getByRole("button", { name: "Sign in" });
    fireEvent.click(signInButtonElement);
    const signInDialog = screen.getByRole("dialog", { name: "Sign In" });

    const modalPresentation = screen.getAllByRole("generic");
    fireEvent.click(modalPresentation[7]);
    expect(signInDialog).not.toBeInTheDocument();
  });
});

describe("new account modal tests", () => {
  test("new account modal loads when new account button is clicked. It closes when the cancel button is clicked", () => {
    render(
      <Router>
        <Splash />
      </Router>
    );
    const newAccountButtonElement = screen.getByRole("button", {
      name: "New account",
    });
    fireEvent.click(newAccountButtonElement);
    const registrationDialog = screen.getByRole("dialog", {
      name: "Create new account",
    });
    expect(registrationDialog).toBeInTheDocument();
    const cancelButtonElement = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButtonElement);
    expect(registrationDialog).not.toBeInTheDocument();
  });
  test("new account modal closes when clicked outside", () => {
    render(
      <Router>
        <Splash />
      </Router>
    );
    const newAccountButtonElement = screen.getByRole("button", {
      name: "New account",
    });
    fireEvent.click(newAccountButtonElement);
    const registrationDialog = screen.getByRole("dialog", {
      name: "Create new account",
    });
    const presentationElement = screen.getAllByRole("generic");
    fireEvent.click(presentationElement[14]);
    expect(registrationDialog).not.toBeInTheDocument();
  });
});
