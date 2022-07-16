import { validateRegistrationData } from "./registration-validator";
afterEach(() => {
  jest.resetAllMocks();
});
const mockRegistrationData = {
  email: "test@example.com",
  firstName: "first",
  lastName: "last",
  password1: "testPassword123",
  password2: "testPassword123",
  onFail: () => null,
};
describe("registration validator tests", () => {
  test("successful validation", () => {
    const successSpy = jest.fn();
    validateRegistrationData({
      ...mockRegistrationData,
      onSuccess: successSpy,
    });
    expect(successSpy).toHaveBeenCalled();
  });
  describe("registration: failed validation scenarios", () => {
    test("email is falsy", () => {
      const failSpy = jest.fn();
      validateRegistrationData({
        ...mockRegistrationData,
        email: null as any,
        onSuccess: () => null,
        onFail: failSpy,
      });
      expect(failSpy).toBeCalledWith({
        field: "email",
        message: "Enter an e-mail",
      });
    });
    test("email is invalid / malformed", () => {
      const failSpy = jest.fn();
      validateRegistrationData({
        ...mockRegistrationData,
        email: "email" as any,
        onSuccess: () => null,
        onFail: failSpy,
      });
      expect(failSpy).toBeCalledWith({
        field: "email",
        message: "Please enter a valid e-mail address",
      });
    });
    test("first name is null, undefined", () => {
      const failSpy = jest.fn();
      validateRegistrationData({
        ...mockRegistrationData,
        firstName: null as any,
        onSuccess: () => null,
        onFail: failSpy,
      });
      expect(failSpy).toBeCalledWith({
        field: "firstName",
        message: "Please enter a first name",
      });
    });
    test("first name is empty string", () => {
      const failSpy = jest.fn();
      validateRegistrationData({
        ...mockRegistrationData,
        firstName: "   ",
        onSuccess: () => null,
        onFail: failSpy,
      });
      expect(failSpy).toBeCalledWith({
        field: "firstName",
        message: "Please enter a first name",
      });
    });
    test("last name is null, undefined", () => {
      const failSpy = jest.fn();
      validateRegistrationData({
        ...mockRegistrationData,
        lastName: null as any,
        onSuccess: () => null,
        onFail: failSpy,
      });
      expect(failSpy).toBeCalledWith({
        field: "lastName",
        message: "Please enter a last name",
      });
    });
    test("last name is empty string", () => {
      const failSpy = jest.fn();
      validateRegistrationData({
        ...mockRegistrationData,
        lastName: "  ",
        onSuccess: () => null,
        onFail: failSpy,
      });
      expect(failSpy).toBeCalledWith({
        field: "lastName",
        message: "Please enter a last name",
      });
    });
    test("password validation", () => {
      const failSpy = jest.fn();
      validateRegistrationData({
        ...mockRegistrationData,
        password1: "1234",
        password2: "1234",
        onSuccess: () => null,
        onFail: failSpy,
      });
      expect(failSpy).toHaveBeenCalled();
    });
  });
});
