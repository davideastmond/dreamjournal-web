import { validateAndSanitizeNewJournalSubmissionData } from "./validators";

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
});
