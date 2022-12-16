import {
  isPasswordValid,
  validateAndSanitizeNewJournalSubmissionData,
} from "./validators";

afterEach(() => {
  jest.resetAllMocks();
});
describe("validator tests", () => {
  test("returns validated strings and a success response", () => {
    function handleSuccessValidation({
      sanitizedTitle,
      sanitizedDescription,
      tagsArray,
    }: {
      sanitizedTitle: string;
      sanitizedDescription: string;
      tagsArray: string[];
    }) {
      expect(tagsArray).toEqual(["123", "doreme", "xyz"]);
      expect(sanitizedDescription).toBe("desc");
      expect(sanitizedTitle).toBe("be be netan");
    }
    const mockCallBack = jest.fn();
    validateAndSanitizeNewJournalSubmissionData({
      title: "be be netan  ",
      description: "desc ",
      tags: "123, doreme, xyz ",
      onFail: mockCallBack,
      onSuccess: handleSuccessValidation,
    });
    expect(mockCallBack).not.toHaveBeenCalled();
  });
  test("success but with empty tags array", () => {
    function handleSuccessValidation({
      sanitizedTitle,
      sanitizedDescription,
      tagsArray,
    }: {
      sanitizedTitle: string;
      sanitizedDescription: string;
      tagsArray: string[];
    }) {
      expect(tagsArray).toEqual([]);
      expect(sanitizedDescription).toBe("desc");
      expect(sanitizedTitle).toBe("be be netan");
    }
    const mockCallBack = jest.fn();
    validateAndSanitizeNewJournalSubmissionData({
      title: "be be netan  ",
      description: "desc ",
      tags: "",
      onFail: mockCallBack,
      onSuccess: handleSuccessValidation,
    });
    expect(mockCallBack).not.toHaveBeenCalled();
  });
  test("returns error responses", () => {
    const handleFailValidation = (validationErrors: string[]) => {
      expect(validationErrors).toEqual([
        "Title is empty",
        "Description is empty",
      ]);
    };
    const mockCallBack = jest.fn();
    validateAndSanitizeNewJournalSubmissionData({
      title: "  ",
      description: "",
      tags: "",
      onFail: handleFailValidation,
      onSuccess: mockCallBack,
    });
    expect(mockCallBack).not.toHaveBeenCalled();
  });
  describe("password valid tests", () => {
    test("password too short", () => {
      const mockData = {
        password1: "12345",
        password2: "12345",
      };

      const mockFail = jest.fn();
      const response = isPasswordValid({ ...mockData, onFail: mockFail });
      expect(mockFail).toHaveBeenCalledWith({
        field: "password",
        message:
          "Password should be at least 8 characters, contain a number and a special character",
      });
      expect(response).toBe(false);
    });
    test("passwords don't match", () => {
      const mockData = {
        password1: "password123456",
        password2: "password1234567",
      };

      const mockFail = jest.fn();
      isPasswordValid({ ...mockData, onFail: mockFail });
      expect(mockFail).toHaveBeenCalledWith({
        field: "password2",
        message:
          "Please enter or confirm your password. Please ensure the passwords match",
      });
    });
    test("function returns error free true", () => {
      const mockFail = jest.fn();
      const mockData = {
        password1: "Password$1234567",
        password2: "Password$1234567",
      };
      const res = isPasswordValid({ ...mockData, onFail: mockFail });
      expect(res).toBe(true);
      expect(mockFail).not.toHaveBeenCalled();
    });
  });
});
