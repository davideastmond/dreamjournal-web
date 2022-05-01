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
