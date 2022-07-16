import { validateLoginData } from "./login-validator";
describe("login validator tests", () => {
  test("fail conditions: no e-mail provided", () => {
    const failEmailCondition = jest.fn();
    validateLoginData({
      email: null as any,
      password: "password123",
      onFail: failEmailCondition,
      onSuccess: () => console.log("something else"),
    });
    expect(failEmailCondition).toHaveBeenCalled();
    expect(failEmailCondition).toBeCalledWith({
      field: "email",
      message: "Enter an e-mail",
    });
  });
  test("fail conditions: invalid e-mail", () => {
    const failEmailCondition = jest.fn();
    validateLoginData({
      email: "e.mail",
      password: "password123",
      onFail: failEmailCondition,
      onSuccess: () => console.log("something else"),
    });
    expect(failEmailCondition).toHaveBeenCalled();
    expect(failEmailCondition).toHaveBeenCalledWith({
      field: "email",
      message: "Please enter a valid e-mail address",
    });
  });
  test("fail condition: password is null", () => {
    const failPasswordCondition = jest.fn();
    validateLoginData({
      email: "test@example.com",
      password: null as any,
      onFail: failPasswordCondition,
      onSuccess: () => console.log("something else"),
    });
    expect(failPasswordCondition).toHaveBeenCalled();
    expect(failPasswordCondition).toHaveBeenCalledWith({
      field: "password",
      message: "Please enter a password that is at least 8 characters long",
    });
  });
  test("fail condition: password is empty string", () => {
    const failPasswordCondition = jest.fn();
    validateLoginData({
      email: "           ",
      password: null as any,
      onFail: failPasswordCondition,
      onSuccess: () => console.log("something else"),
    });
    expect(failPasswordCondition).toHaveBeenCalled();
    expect(failPasswordCondition).toHaveBeenCalledWith({
      field: "password",
      message: "Please enter a password that is at least 8 characters long",
    });
  });
  test("success condition is called", () => {
    const successCondition = jest.fn();
    validateLoginData({
      email: "test@example.com",
      password: "password$12345",
      onFail: () => console.log("something failed"),
      onSuccess: successCondition,
    });
    expect(successCondition).toHaveBeenCalled();
  });
});
