import { render, fireEvent, screen } from "../../utils/test-utils/test-utils";
import TwoFactorValidate from "./TwoFactorValidate";

describe("2fa validate tests", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("click callback is called when user selects verify button", () => {
    const spy = jest.fn();
    render(
      <TwoFactorValidate token="dummyToken" onVerifyButtonClicked={spy} />
    );
    const dummyAuthCode = "145678";
    const verifyButton = screen.getByRole("button", { name: /verify/i });
    const authCodeTextInput = screen.getByPlaceholderText(/code/i);
    fireEvent.change(authCodeTextInput, {
      target: {
        value: dummyAuthCode,
      },
    });
    fireEvent.click(verifyButton);
    expect(spy).toHaveBeenCalledWith(dummyAuthCode);
  });
});
