import { InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteJournalByIdAsync,
  getAllJournalsForUserAsync,
  selectJournalById,
} from "../../reducers/journal-slice";
import EditIcon from "@mui/icons-material/Edit";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import "./style.css";
import { getFormattedDate } from "../../utils/string-helpers";
import { JournalEntriesList } from "../../components/JournalEntriesList";
import { NotFound404 } from "../NotFound404";
import { textAreaStyling } from "../../styling/text-styling";
import { patchJournalAttribute } from "../../services/journal/journal.service";
import {
  getSessionUserAsync,
  selectSessionUser,
} from "../../reducers/app-slice";
import { ActionDialog } from "../../components/ActionDialog";

function JournalScene() {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const journalContext = useSelector(
    selectJournalById(journalId!),
    shallowEqual
  );
  const sessionUser = useSelector(selectSessionUser, shallowEqual);
  const [journalTitleText, setJournalTitleText] = useState<string | null>(
    journalContext?.title || null
  );
  const [journalDescriptionText, setJournalDescriptionText] = useState<
    string | null
  >(journalContext?.description || null);

  const [rawJournalTagString, setRawJournalTagString] = useState<string>(
    journalContext?.tags ? journalContext.tags.join(", ") : ""
  );
  const [actionDialogOpen, setActionDialogOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (journalContext) {
      setJournalTitleText(journalContext.title);
      journalContext.description &&
        setJournalDescriptionText(journalContext.description);
      journalContext.tags &&
        journalContext.tags.length &&
        journalContext.tags.length > 0 &&
        setRawJournalTagString(journalContext.tags.join(", "));
    }
  }, [journalContext]);
  const handleTextInputChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const element = event.target.id;

    switch (element) {
      case "journalTitle":
        if (event.target.value.trim() !== "") {
          setJournalTitleText(event.target.value);
        }
        break;
      case "journalDescription":
        setJournalDescriptionText(event.target.value);
        break;
      case "journalTags":
        setRawJournalTagString(event.target.value);
        break;
    }
  };

  const handleDeleteJournal = () => {
    // Do some delete action
    if (journalContext) {
      dispatch(deleteJournalByIdAsync({ journalId: journalContext._id }));
      dispatch(getSessionUserAsync());
      navigate("/home");
    }
    setActionDialogOpen(false);
  };

  const handleOnElementOnBlur = async (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    if (!journalContext || !sessionUser) return;
    const element = event.target.id;
    switch (element) {
      case "journalTitle":
        if (journalTitleText && journalTitleText.trim() !== "") {
          await patchJournalAttribute({
            journalId: journalContext?._id,
            patchObject: {
              title: { action: "update", data: journalTitleText },
            },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        } else if (journalTitleText && journalTitleText.trim() === "") {
          await patchJournalAttribute({
            journalId: journalContext._id,
            patchObject: { title: { action: "delete", data: "" } },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        }
        break;
      case "journalDescription":
        if (journalDescriptionText && journalDescriptionText.trim() !== "") {
          await patchJournalAttribute({
            journalId: journalContext?._id,
            patchObject: {
              description: { action: "update", data: journalDescriptionText },
            },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        } else if (
          journalDescriptionText &&
          journalDescriptionText.trim() === ""
        ) {
          await patchJournalAttribute({
            journalId: journalContext._id,
            patchObject: { description: { action: "delete", data: "" } },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        }
        break;
      case "journalTags":
        if (rawJournalTagString.trim() === "") {
          await patchJournalAttribute({
            journalId: journalContext._id,
            patchObject: { tags: { action: "delete", data: [] } },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        } else {
          const parsedTags = rawJournalTagString.split(",");
          const trimmedTags = parsedTags.map((tag) => tag.trim());
          await patchJournalAttribute({
            journalId: journalContext._id,
            patchObject: { tags: { action: "update", data: trimmedTags } },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        }
    }
  };

  const handleNavigateToNewJournalEntry = () => {
    journalContext && navigate(`/journals/${journalContext?._id}/new`);
  };

  return journalContext ? (
    <div className="JournalContext__main">
      <div className="JournalContext__main__backToJournals">
        <Link to="/home">
          <div>
            <ArrowLeftIcon />
            Journals
          </div>
        </Link>
      </div>
      <header className="JournalContext__main__Header">
        <div className="JournalContext__main__titleHeader">
          <div>
            <h2>{journalContext?.title}</h2>
          </div>
        </div>
        <TextField
          sx={textAreaStyling}
          autoFocus
          margin="dense"
          id="journalTitle"
          type="text"
          label="Title"
          fullWidth
          focused
          variant="filled"
          onChange={handleTextInputChanged}
          value={journalTitleText}
          onBlur={handleOnElementOnBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon htmlColor="white" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          sx={textAreaStyling}
          autoFocus
          margin="dense"
          id="journalDescription"
          type="text"
          label="Description"
          fullWidth
          focused
          variant="filled"
          onChange={handleTextInputChanged}
          value={journalDescriptionText}
          onBlur={handleOnElementOnBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon htmlColor="white" />
              </InputAdornment>
            ),
          }}
        />
        <div className="JournalContext__main__updateDateSection">
          <TextField
            label="Created"
            sx={textAreaStyling}
            focused
            variant="filled"
            value={getFormattedDate({
              dateString: journalContext?.createdAt.toString()!,
            })}
          />
          <TextField
            label="Last updated"
            sx={textAreaStyling}
            focused
            variant="filled"
            value={getFormattedDate({
              dateString: journalContext?.updatedAt.toString()!,
            })}
          />
          <TextField
            label="id"
            sx={textAreaStyling}
            focused
            variant="filled"
            value={journalContext?._id}
          />
        </div>
        <div className="JournalContext__tags-enclosure">
          <TextField
            sx={textAreaStyling}
            autoFocus
            margin="dense"
            id="journalTags"
            type="text"
            label="Tags"
            fullWidth
            focused
            variant="filled"
            onChange={handleTextInputChanged}
            value={rawJournalTagString}
            onBlur={handleOnElementOnBlur}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon htmlColor="white" />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </header>
      <section>
        <div
          className="delete-journal align-right cursor-hover warning-color"
          onClick={() => setActionDialogOpen(true)}
        >
          Delete Journal
        </div>
      </section>
      <section className="JournalEntries__main__body">
        <header className="top-margin-buffer">
          <Typography variant="h4">Entries</Typography>
        </header>
        <JournalEntriesList
          entries={
            journalContext && journalContext.journalEntries
              ? journalContext.journalEntries
              : []
          }
          onClickAddNewJournalEntry={handleNavigateToNewJournalEntry}
        />
      </section>
      <ActionDialog
        type={"delete"}
        open={actionDialogOpen}
        promptText={`Are you sure you want to delete journal "${journalContext.title}" ?`}
        onActionConfirmed={handleDeleteJournal}
        onDismiss={() => setActionDialogOpen(false)}
      />
    </div>
  ) : (
    <NotFound404 />
  );
}
export default JournalScene;
