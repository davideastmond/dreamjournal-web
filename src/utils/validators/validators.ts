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
  if (!password1 || password1.trim() === "") {
    foundError = false;
    onFail({
      field: "password1",
      message: "Enter a password that is at least 8 characters long",
    });
  }

  if (password1.length < 8) {
    foundError = false;
    onFail({
      field: "password1",
      message: "Enter a password that is at least 8 characters long",
    });
  }
  if (password2.trim() !== password1.trim() || password2.trim() === "") {
    foundError = false;
    onFail({
      field: "password2",
      message: "Please confirm password, and ensure passwords match",
    });
  }
  return foundError;
}
