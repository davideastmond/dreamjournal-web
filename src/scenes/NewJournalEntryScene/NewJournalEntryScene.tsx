import { Stack, Alert } from "@mui/material";
import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectSessionUser } from "../../reducers/app-slice";
import {
  getAllJournalsForUserAsync,
  selectJournalById,
} from "../../reducers/journal-slice";
import { addEntryToJournal } from "../../services/journal/journal.service";
import { validateAndSanitizeNewJournalSubmissionData } from "../../utils/validators/validators";
import NewJournalEntryBodyText from "./NewJournalEntryBody";
import NewJournalEntryHeader from "./NewJournalEntryHeader";

function NewJournalEntryScene() {
  const [bodyText, setBodyText] = useState<string | null>(null);
  const [tags, setTags] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const [hasSubmissionError, setHasSubmissionError] = useState<boolean>(false);
  const [submissionErrors, setSubmissionErrors] = useState<string[]>([]);

  const { journalId } = useParams();
  const journalContext = useSelector(selectJournalById(journalId!));
  const userContext = useSelector(selectSessionUser, shallowEqual);
  const handleJouralEntryBodyTextChange = (text: string) => {
    setBodyText(text);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleHeaderDataChanged = (
    changeType: "title" | "description" | "tags",
    data: string
  ) => {
    switch (changeType) {
      case "title":
        setTitle(data);
        break;
      case "description":
        setDescription(data);
        break;
      case "tags":
        setTags(data);
        break;
    }
  };

  const validateJournalContext = (): boolean => {
    if (journalContext && journalContext._id === journalId) return true;
    return false;
  };
  const handleValidateAndSubmit = () => {
    clearSubmissionErrors();
    if (!validateJournalContext()) {
      setHasSubmissionError(true);
      setSubmissionErrors([
        "We encountered a problem with the journal id and the context. Refresh the page, or log in.",
      ]);
    }
    if (!userContext) {
      setHasSubmissionError(true);
      setSubmissionErrors([
        "There was an authentication error. Please sign in.",
      ]);
    }
    validateAndSanitizeNewJournalSubmissionData({
      title: title!,
      description: description!,
      tags: tags!,
      onSuccess: async ({
        sanitizedTitle,
        sanitizedDescription,
        tagsArray,
      }) => {
        try {
          await addEntryToJournal({
            journalId: journalId!,
            title: sanitizedTitle,
            description: sanitizedDescription,
            tags: tagsArray,
            text: bodyText ?? "",
          });
          dispatch(getAllJournalsForUserAsync({ userId: userContext?._id! }));
          navigate(`/journals/${journalId}`);
        } catch (exception: any) {
          setHasSubmissionError(true);
          setSubmissionErrors([exception.message]);
        }
      },
      onFail: (message: string[]) => {
        setSubmissionErrors(message);
        setHasSubmissionError(true);
      },
    });
  };

  const clearSubmissionErrors = () => {
    setHasSubmissionError(false);
    setSubmissionErrors([]);
  };
  return (
    <div className="NewJournalEntryScene__main">
      <header>
        <div className="top-margin-buffer">New Journal Entry</div>
      </header>
      <NewJournalEntryHeader onHeaderDataChanged={handleHeaderDataChanged} />
      <NewJournalEntryBodyText onTextChange={handleJouralEntryBodyTextChange} />
      <footer className="JournalEntryText__footer__main">
        {hasSubmissionError && (
          <Stack sx={{ width: "100%" }} spacing={0}>
            {submissionErrors &&
              submissionErrors.map((error, index) => (
                <Alert key={`${index}_error`} severity="error">
                  {error}
                </Alert>
              ))}
          </Stack>
        )}
        <div
          className="JournalEntryText__footer__submit cursor-hover"
          onClick={handleValidateAndSubmit}
        >
          Submit
        </div>
      </footer>
    </div>
  );
}

export default NewJournalEntryScene;
