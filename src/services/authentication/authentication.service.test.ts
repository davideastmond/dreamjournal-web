import { logInUser, registerUser } from "./authentication.service";
import axios from "axios";
jest.mock("axios");

afterEach(() => {
  jest.resetAllMocks();
});
const mockData = {
  firstName: "first",
  lastName: "last",
  email: "test@example.com",
  plainTextPassword: "password$1234",
  dateOfBirth: new Date().toString(),
};
describe("authentication service tests", () => {
  describe("logInUser tests", () => {
    test("throws an error for a non 200 response", async () => {
      const email = "test@example.com";
      const password = "testPassword123";
      (axios as any).mockImplementation(() => {
        return Promise.reject({
          status: 500,
          data: {},
        });
      });
      await expect(() => logInUser({ email, password })).rejects.toThrow();
    });
  });

  describe("register user tests", () => {
    test("on success method is called after registration", async () => {
      const mockSuccessCallBack = jest.fn();

      (axios as any)
        .mockImplementationOnce(() => {
          return Promise.resolve({
            status: 200,
            data: {},
          });
        })
        .mockImplementationOnce(() => {
          return Promise.resolve({
            status: 200,
            data: {
              token: "mockToken",
              issued: 1234,
              expires: 1234,
            },
          });
        });
      await registerUser({
        ...mockData,
        onSuccess: mockSuccessCallBack,
        onError: () => null,
      });
      expect(mockSuccessCallBack).toHaveBeenCalled();
    });
    test("onError callback is called during error condition", async () => {
      const mockFailCallBack = jest.fn();
      (axios as any).mockImplementationOnce(() => {
        return Promise.reject({
          status: 404,
          data: {},
        });
      });
      await registerUser({
        ...mockData,
        onSuccess: () => null,
        onError: mockFailCallBack,
      });
      expect(mockFailCallBack).toHaveBeenCalledWith("Registration Error");
    });
  });
});
