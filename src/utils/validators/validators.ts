export function validateAndSanitizeNewJournalSubmissionData({
  title,
  description,
  tags,
  onSuccess,
  onFail,
}: {
  onFail: (validationMessages: string[]) => void;
  title: string;
  description: string;
  tags: string;
  onSuccess: ({
    sanitizedTitle,
    sanitizedDescription,
    tagsArray,
  }: {
    sanitizedTitle: string;
    sanitizedDescription: string;
    tagsArray: string[];
  }) => void;
}) {
  let nTitle: string = "";
  let nDescription: string = "";
  let nTags: string[] = [];
  const messages: string[] = [];
  if (!title || title.trim() === "") {
    messages.push("Title is empty");
  }

  if (!description || description.trim() === "") {
    messages.push("Description is empty");
  }

  nTitle = title?.trim();
  nDescription = description?.trim();
  if (tags && tags.trim() !== "") {
    nTags = tags.split(",");
    nTags = nTags.map((tag) => {
      return tag.trim();
    });
  }
  if (messages.length > 0) {
    onFail(messages);
    return;
  }

  onSuccess({
    sanitizedTitle: nTitle,
    sanitizedDescription: nDescription,
    tagsArray: nTags,
  });
}

export function isPasswordValid({
  password1,
  password2,
  onFail,
}: {
  password1: string;
  password2: string;
  onFail: ({ field, message }: { field: string; message: string }) => void;
}): boolean {
  let foundError = true;
  if (password2.trim() !== password1.trim() || password2.trim() === "") {
    foundError = false;
    onFail({
      field: "password2",
      message:
        "Please enter or confirm your password. Please ensure the passwords match",
    });
  }
  // Password complexity
  const pw1ComplexityTest: boolean = new RegExp(
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  ).test(password1);
  const pw2ComplexityTest: boolean = new RegExp(
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  ).test(password2);
  if (!(pw1ComplexityTest && pw2ComplexityTest)) {
    foundError = false;
    onFail({
      field: "password",
      message:
        "Password should be at least 8 characters, contain a number and a special character",
    });
  }
  return foundError;
}
