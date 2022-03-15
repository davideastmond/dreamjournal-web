import { TextField, Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import "./style.css";
import { validateAndSanitizeNewJournalSubmissionData } from "./validators";
import { submitNewJournal } from "../../services/journal/journal.service";
import { selectSessionUser } from "../../reducers/app-slice";
import { shallowEqual, useSelector } from "react-redux";

export interface INewJournalSubmissionProps {
  onSuccessfulSubmission?: () => void;
}
/**
 * This will appear when the user has no journal
 *
 * @returns
 */
export function NewJournal(props: INewJournalSubmissionProps) {
  const userData = useSelector(selectSessionUser, shallowEqual);
  const [journalTitleText, setJournalTitleText] = useState("");
  const [journalDescriptionText, setJournalDescriptionText] = useState("");
  const [journalTags, setJournalTags] = useState("");

  const [hasSubmissionError, setHasSubmissionError] = useState<boolean>(false);
  const [submissionErrors, setSubmissionErrors] = useState<string[]>([]);

  const handleOnTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === "title") setJournalTitleText(event.target.value);
    if (event.target.id === "description")
      setJournalDescriptionText(event.target.value);
    if (event.target.id === "tags") setJournalTags(event.target.value);
  };

  const handleSubmitAndValidate = async () => {
    clearErrorMessages();
    validateAndSanitizeNewJournalSubmissionData({
      title: journalTitleText,
      description: journalDescriptionText,
      tags: journalTags,
      onSuccess: async ({
        sanitizedDescription,
        sanitizedTitle,
        tagsArray,
      }) => {
        // Dispatch some action
        console.log("Success!");
        if (userData) {
          try {
            await submitNewJournal({
              userId: userData._id,
              title: sanitizedTitle,
              description: sanitizedDescription,
              tags: tagsArray,
            });
            props.onSuccessfulSubmission && props.onSuccessfulSubmission();
          } catch (exception: any) {
            setHasSubmissionError(true);
            setSubmissionErrors([`${exception.message}`]);
          }
        } else {
          setHasSubmissionError(true);
          setSubmissionErrors(["Unable to authenticate this session"]);
        }
      },
      onFail: (messages: string[]) => {
        // Show a validation error
        setHasSubmissionError(true);
        setSubmissionErrors(messages);
      },
    });
  };

  const clearErrorMessages = () => {
    setSubmissionErrors([]);
    setHasSubmissionError(false);
  };
  return (
    <div className="Scene NewJournal__Main">
      <Typography
        variant="h4"
        sx={{
          color: "white",
        }}
      >
        Create New Journal
      </Typography>
      <TextField
        sx={{
          "& .MuiOutlinedInput-input": {
            color: "white",
          },
          "& .MuiOutlinedInput-root": {
            borderColor: "white",
            borderLeftStyle: "solid",
            borderRightStyle: "solid",
            borderWidth: "1px",
          },
          "& .MuiTextField-root": {
            marginTop: "20",
          },
        }}
        onChange={handleOnTextChange}
        label="Title"
        id="title"
        name="title"
        placeholder="Enter a journal title"
        required={true}
        color="primary"
        variant="outlined"
        fullWidth
        focused
        margin="normal"
      />
      <TextField
        sx={{
          "& .MuiOutlinedInput-input": {
            color: "white",
          },
          "& .MuiOutlinedInput-root": {
            borderColor: "white",
            borderLeftStyle: "solid",
            borderRightStyle: "solid",
            borderWidth: "1px",
          },
          marginTop: "16px",
        }}
        onChange={handleOnTextChange}
        label="Description"
        id="description"
        name="description"
        placeholder="Enter a description"
        required={true}
        color="primary"
        variant="outlined"
        fullWidth
        focused
      />
      <TextField
        onChange={handleOnTextChange}
        label="tags"
        id="tags"
        name="tags"
        placeholder="Enter some optional tags"
        color="primary"
        variant="outlined"
        focused
        fullWidth
        sx={{
          "& .MuiOutlinedInput-input": {
            color: "white",
          },
          "& .MuiOutlinedInput-root": {
            borderColor: "white",
            borderLeftStyle: "solid",
            borderRightStyle: "solid",
            borderWidth: "1px",
          },
          marginTop: "16px",
        }}
      ></TextField>
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
      <Box>
        <Button
          onClick={handleSubmitAndValidate}
          fullWidth
          variant="contained"
          sx={{
            marginTop: "16px",
          }}
        >
          Go
        </Button>
      </Box>
    </div>
  );
}

export default NewJournal;
