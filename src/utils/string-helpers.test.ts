import { isEmailValid } from "./string-helpers";

describe("string helper tests", () => {
  describe("email valid", () => {
    test("email is valid", () => {
      const testEmail = "sample@example.com";
      const res = isEmailValid({ email: testEmail });
      expect(res).toBe(true);
    });
    test("email is invalid", () => {
      const testEmail = "sample@.com";
      const res = isEmailValid({ email: testEmail });
      expect(res).toBe(false);
    });
  });
});
