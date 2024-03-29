import { Stack, Alert, styled, Box, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { StyledButtonComponent } from "../../components/StyledButton";
import { StyledHeaderComponent } from "../../components/StyledHeader";
import { selectSessionUser } from "../../reducers/app-slice";
import {
  getAllJournalsForUserAsync,
  selectJournalById,
} from "../../reducers/journal-slice";
import { addEntryToJournal } from "../../services/journal/journal.service";
import { pallet } from "../../styling/pallets";
import { validateAndSanitizeNewJournalSubmissionData } from "../../utils/validators/validators";
import NewJournalEntryBody from "./NewJournalEntryBody";
import NewJournalEntryHeader from "./NewJournalEntryHeader";

function NewJournalEntryScene() {
  const [bodyText, setBodyText] = useState<string | null>("");
  const [tags, setTags] = useState<string | null>("");
  const [description, setDescription] = useState<string | null>("");
  const [title, setTitle] = useState<string | null>("");
  const [journalEntryDate, setJournalEntryDate] = useState<any>("");

  const [hasSubmissionError, setHasSubmissionError] = useState<boolean>(false);
  const [submissionErrors, setSubmissionErrors] = useState<string[]>([]);
  const [lucidChecked, setLucidChecked] = useState<boolean>(false);
  const { journalId } = useParams();
  const journalContext = useSelector(selectJournalById(journalId!));
  const userContext = useSelector(selectSessionUser, shallowEqual);
  const handleJournalEntryBodyTextChange = (text: string) => {
    setBodyText(text);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleHeaderDataChanged = (
    changeType: "title" | "description" | "tags" | "journalEntryDate",
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
      case "journalEntryDate":
        const isoDate = (data as any).$d.toISOString();
        setJournalEntryDate(isoDate);
        break;
    }
  };

  const StyledAlert = styled(Alert)((props) => ({
    "&.MuiAlert-root": {
      backgroundColor: pallet.black,
      color: pallet.lightSalmon,
    },
  }));

  const validateJournalContext = (): boolean => {
    if (journalContext && journalContext._id === journalId) return true;
    return false;
  };

  const handleCancelNewJournal = () => {
    navigate(-1);
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
            entryDate: journalEntryDate,
            lucid: lucidChecked,
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
    <FormControl>
      <Box>
        <StyledHeaderComponent
          text="New Journal Entry"
          sizeVariant="h4"
          customClassNames="small-top-margin"
        />
        <NewJournalEntryHeader onHeaderDataChanged={handleHeaderDataChanged} />
        <NewJournalEntryBody
          onTextChange={handleJournalEntryBodyTextChange}
          onLucidCheckBoxChanged={(checked: boolean) =>
            setLucidChecked(checked)
          }
        />
        <footer className="JournalEntryText__footer__main">
          {hasSubmissionError && (
            <Stack sx={{ width: "100%" }} spacing={0}>
              {submissionErrors &&
                submissionErrors.map((error, index) => (
                  <StyledAlert key={`${index}_error`} severity="error">
                    {error}
                  </StyledAlert>
                ))}
            </Stack>
          )}
          <Box
            mt={4}
            display={"flex"}
            justifyContent={"space-between"}
            pl={7}
            pr={7}
          >
            <StyledButtonComponent
              textLabel="Submit"
              variant="contained"
              onClick={handleValidateAndSubmit}
              fillColor={pallet.aquaBlueGreen}
            />
            <StyledButtonComponent
              textLabel="Cancel"
              variant="contained"
              onClick={handleCancelNewJournal}
              fillColor={pallet.lightSalmon}
            />
          </Box>
        </footer>
      </Box>
    </FormControl>
  );
}

export default NewJournalEntryScene;
