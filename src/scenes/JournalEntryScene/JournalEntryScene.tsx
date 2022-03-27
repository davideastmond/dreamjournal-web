import { InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { selectJournalEntryById } from "../../reducers/journal-slice";
import { textAreaStyling } from "../../styling/text-styling";
import { NotFound404 } from "../NotFound404";
import EditIcon from "@mui/icons-material/Edit";
import { getFormattedDate } from "../../utils/string-helpers";
import "./style.css";
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

  const handleTextInputChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const elementId = event.target.id;
    switch (elementId) {
      case "journalEntryText":
        setJournalEntryText(event.target.value);
    }
  };

  const handleClickAwayEntryText = () => {
    console.log(
      "click away from text",
      journalEntryContext?.text,
      journalEntryText
    );
    const isEntryTextMatch = journalEntryContext?.text === journalEntryText;

    console.log(isEntryTextMatch);
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
            onBlur={handleClickAwayEntryText}
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
    </div>
  ) : (
    <NotFound404 />
  );
}

export default JournalEntryScene;
