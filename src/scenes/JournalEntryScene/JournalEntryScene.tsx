import { InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  getAllJournalsForUserAsync,
  selectJournalEntryById,
} from "../../reducers/journal-slice";
import { textAreaStyling } from "../../styling/text-styling";
import { NotFound404 } from "../NotFound404";
import EditIcon from "@mui/icons-material/Edit";
import { getFormattedDate } from "../../utils/string-helpers";
import "./style.css";
import { patchJournalEntry } from "../../services/journal/journal.service";
import { selectSessionUser } from "../../reducers/app-slice";
/**
 * Title, description, text, created, updated, tags
 */

function JournalEntryScene() {
  const [searchParams] = useSearchParams();
  const journalId = searchParams.get("journalId");
  const journalEntryId = searchParams.get("journalEntryId");
  const journalEntryContext = useSelector(
    selectJournalEntryById({ journalId, journalEntryId }),
    shallowEqual
  );
  const sessionUser = useSelector(selectSessionUser, shallowEqual);
  const [journalEntryTitle, setJournalEntryTitle] = useState<string>(
    journalEntryContext?.title || ""
  );
  const [journalEntryDescription, setJournalEntryDescription] =
    useState<string>(journalEntryContext?.description || "");
  const [journalEntryTags, setJournalEntryTags] = useState<string>(
    journalEntryContext?.tags.join(", ") || ""
  );
  const [journalEntryText, setJournalEntryText] = useState<string>(
    journalEntryContext?.text || ""
  );

  const dispatch = useDispatch();
  const handleTextInputChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const elementId = event.target.id;
    switch (elementId) {
      case "journalEntryTitle":
        setJournalEntryTitle(event.target.value);
        break;
      case "journalEntryDescription":
        setJournalEntryDescription(event.target.value);
        break;
      case "journalEntryTags":
        setJournalEntryTags(event.target.value);
        break;
      case "journalEntryText":
        setJournalEntryText(event.target.value);
        break;
    }
  };

  const handleElementOnBlur = async (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const element = event.target.id;
    if (!journalId || !journalEntryId || !sessionUser) return;
    switch (element) {
      case "journalEntryTitle":
        if (journalEntryTitle && journalEntryTitle.trim() !== "") {
          await patchJournalEntry({
            journalId,
            journalEntryId,
            patchObject: {
              title: { action: "update", data: journalEntryTitle },
            },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        } else if (journalEntryTitle && journalEntryTitle.trim() === "") {
          await patchJournalEntry({
            journalId,
            journalEntryId,
            patchObject: { title: { action: "delete", data: "" } },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        }
        break;
      case "journalEntryDescription":
        if (journalEntryDescription && journalEntryDescription.trim() !== "") {
          await patchJournalEntry({
            journalId,
            journalEntryId,
            patchObject: {
              description: { action: "update", data: journalEntryDescription },
            },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        } else if (
          journalEntryDescription &&
          journalEntryDescription.trim() === ""
        ) {
          await patchJournalEntry({
            journalId,
            journalEntryId,
            patchObject: {
              description: { action: "delete", data: "" },
            },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        }
        break;
      case "journalEntryTags":
        if (journalEntryTags.trim() === "") {
          await patchJournalEntry({
            journalId,
            journalEntryId,
            patchObject: { tags: { action: "delete", data: [] } },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        } else {
          const parsedTags = journalEntryTags.split(",");
          const trimmedTags = parsedTags.map((tag) => tag.trim());
          await patchJournalEntry({
            journalId,
            journalEntryId,
            patchObject: { tags: { action: "update", data: trimmedTags } },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        }
        break;
      case "journalEntryText":
        if (journalEntryText && journalEntryText.trim() === "") {
          await patchJournalEntry({
            journalId,
            journalEntryId,
            patchObject: {
              text: { action: "delete", data: "" },
            },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        } else {
          await patchJournalEntry({
            journalId,
            journalEntryId,
            patchObject: {
              text: { action: "update", data: journalEntryText },
            },
          });
          dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
        }
        break;
    }
  };

  return journalEntryContext ? (
    <div className="JournalEntry__Main">
      {journalId && journalId !== "" && (
        <section className="JournalEntryContext__navigate">
          <Link to={`/journals/${journalId}`}>Back to journal</Link>
        </section>
      )}
      <header>
        <Typography variant="h4">{journalEntryContext.title}</Typography>
        <TextField
          sx={textAreaStyling}
          autoFocus
          margin="dense"
          id="journalEntryTitle"
          type="text"
          label="Title"
          fullWidth
          focused
          variant="filled"
          onChange={handleTextInputChanged}
          value={journalEntryTitle}
          onBlur={handleElementOnBlur}
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
          id="journalEntryDescription"
          type="text"
          label="Description"
          fullWidth
          focused
          variant="filled"
          onChange={handleTextInputChanged}
          value={journalEntryDescription}
          onBlur={handleElementOnBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon htmlColor="white" />
              </InputAdornment>
            ),
          }}
        />
        {journalEntryContext && (
          <div className="JournalEntryContext__main__updateDateSection">
            <TextField
              label="Created"
              sx={textAreaStyling}
              focused
              variant="filled"
              value={getFormattedDate({
                dateString: journalEntryContext?.createdAt!.toString()!,
              })}
            />
            <TextField
              label="Last updated"
              sx={textAreaStyling}
              focused
              variant="filled"
              value={getFormattedDate({
                dateString: journalEntryContext?.updatedAt!.toString()!,
              })}
            />
            <TextField
              label="id"
              sx={textAreaStyling}
              focused
              variant="filled"
              value={journalEntryContext?._id}
            />
          </div>
        )}
        <div className="JournalEntryContext__tags-enclosure">
          <TextField
            sx={textAreaStyling}
            autoFocus
            margin="dense"
            id="journalEntryTags"
            type="text"
            label="Tags"
            fullWidth
            focused
            variant="filled"
            onChange={handleTextInputChanged}
            value={journalEntryTags}
            onBlur={handleElementOnBlur}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon htmlColor="white" />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="JournalEntryContext__multilineText">
          <TextField
            sx={textAreaStyling}
            autoFocus
            margin="dense"
            id="journalEntryText"
            multiline
            type="text"
            label="Text"
            fullWidth
            focused
            onBlur={handleElementOnBlur}
            variant="filled"
            onChange={handleTextInputChanged}
            value={journalEntryText}
            rows={6}
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
      <footer className="top-margin-buffer">
        <div className="EditJournalEntry__submit pointer-hover">Submit</div>
      </footer>
    </div>
  ) : (
    <NotFound404 />
  );
}

export default JournalEntryScene;
