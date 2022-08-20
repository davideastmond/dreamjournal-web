import { Box, Button, FormControl, styled } from "@mui/material";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import "./style.css";

import { submitNewJournal } from "../../services/journal/journal.service";
import { selectSessionUser } from "../../reducers/app-slice";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getAllJournalsForUserAsync } from "../../reducers/journal-slice";
import { Link, useNavigate } from "react-router-dom";
import { validateAndSanitizeNewJournalSubmissionData } from "../../utils/validators/validators";
import { StyledHeaderComponent } from "../../components/StyledHeader";
import { pallet } from "../../styling/pallets";
import { StyledTextFieldComponent } from "../../components/StyledTextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const StyledFormControl = styled(FormControl)((props) => ({
  [props.theme.breakpoints.down("sm")]: {
    width: "90%",
  },
  [props.theme.breakpoints.up("sm")]: {
    width: "70%",
  },
  marginTop: "2%",
}));

const textFieldSpacingStyle = {
  marginTop: "10px",
  marginBottom: "10px",
};
export function NewJournal() {
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        if (userData) {
          try {
            const newJournal = await submitNewJournal({
              userId: userData._id,
              title: sanitizedTitle,
              description: sanitizedDescription,
              tags: tagsArray,
            });
            dispatch(getAllJournalsForUserAsync({ userId: userData._id }));
            navigate(`/journals/${newJournal.journal._id}`);
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
        setHasSubmissionError(true);
        setSubmissionErrors(messages);
      },
    });
  };

  const clearErrorMessages = () => {
    setSubmissionErrors([]);
    setHasSubmissionError(false);
  };

  useEffect(() => {
    if (userData) {
      dispatch(getAllJournalsForUserAsync({ userId: userData._id }));
    }
  }, []);
  return (
    <div className="Scene NewJournal__Main">
      <Box display="flex" justifyContent={"space-between"}>
        <Link to="/home">
          <ArrowBackIcon
            sx={{
              padding: "10px",
            }}
          />
        </Link>
      </Box>
      <StyledHeaderComponent text="Create new journal" />
      <Box>
        <StyledFormControl>
          <StyledTextFieldComponent
            onChange={handleOnTextChange}
            label="Title"
            id="title"
            name="title"
            placeholder="Enter a journal title"
            required={true}
            fullWidth
            focused
            customStyles={textFieldSpacingStyle}
          />
          <StyledTextFieldComponent
            onChange={handleOnTextChange}
            label="Description"
            id="description"
            name="description"
            placeholder="Enter a description"
            required={true}
            fullWidth
            focused
            customStyles={textFieldSpacingStyle}
          />
          <StyledTextFieldComponent
            onChange={handleOnTextChange}
            label="tags"
            id="tags"
            name="tags"
            placeholder="Enter some optional tags"
            color="primary"
            variant="outlined"
            focused
            fullWidth
            customStyles={textFieldSpacingStyle}
          />
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
          <Button
            onClick={handleSubmitAndValidate}
            fullWidth
            variant="contained"
            sx={{
              marginTop: "16px",
              backgroundColor: pallet.redWine,
            }}
          >
            Create
          </Button>
        </StyledFormControl>
      </Box>
    </div>
  );
}

export default NewJournal;
