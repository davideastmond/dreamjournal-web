import { InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { StyledTextFieldComponent } from "../../components/StyledTextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { StyledTextFieldDivSection } from "../../components/StyledTextFieldDivSection";
import { StyledHeaderComponent } from "../../components/StyledHeader";
import { StyledReadOnlyPropertiesSection } from "../../components/StyledReadOnlyJournalPropertiesSection";
/**
 * Title, description, text, created, updated, tags
 */
const textFieldSpacingStyle = {
  marginTop: "10px",
  marginBottom: "10px",
};

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
  const navigate = useNavigate();
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
      <div className="JournalContext__main__backToJournals">
        {journalId && journalId !== "" && (
          <div className="cursor-hover" onClick={() => navigate(-1)}>
            <ArrowBackIcon
              sx={{
                padding: "10px",
              }}
            />
          </div>
        )}
      </div>
      <StyledHeaderComponent
        text={journalEntryContext.title}
        sizeVariant="h4"
      />
      <StyledHeaderComponent text="Journal Entry" sizeVariant="h6" />
      <StyledTextFieldDivSection>
        <StyledTextFieldComponent
          id="journalEntryTitle"
          type="text"
          label="Title"
          onChange={handleTextInputChanged}
          value={journalEntryTitle}
          onBlur={handleElementOnBlur}
          customStyles={textFieldSpacingStyle}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon htmlColor="white" />
              </InputAdornment>
            ),
          }}
        />
      </StyledTextFieldDivSection>
      <StyledTextFieldDivSection>
        <StyledTextFieldComponent
          id="journalEntryDescription"
          type="text"
          label="Description"
          onChange={handleTextInputChanged}
          value={journalEntryDescription}
          onBlur={handleElementOnBlur}
          customStyles={textFieldSpacingStyle}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon htmlColor="white" />
              </InputAdornment>
            ),
          }}
        />
      </StyledTextFieldDivSection>
      {journalEntryContext && (
        <StyledReadOnlyPropertiesSection>
          <StyledTextFieldDivSection>
            <StyledTextFieldComponent
              label="Created"
              customInputStyles={{
                padding: "20px",
              }}
              value={getFormattedDate({
                dateString: journalEntryContext?.createdAt?.toString()!,
              })}
            />
          </StyledTextFieldDivSection>
          <StyledTextFieldDivSection>
            <StyledTextFieldComponent
              label="Last updated"
              customInputStyles={{
                padding: "20px",
              }}
              value={getFormattedDate({
                dateString: journalEntryContext?.updatedAt?.toString()!,
              })}
            />
          </StyledTextFieldDivSection>
          <StyledTextFieldDivSection>
            <StyledTextFieldComponent
              label="id"
              customInputStyles={{
                padding: "20px",
              }}
              value={journalEntryContext?._id}
            />
          </StyledTextFieldDivSection>
        </StyledReadOnlyPropertiesSection>
      )}
      <StyledTextFieldDivSection>
        <StyledTextFieldComponent
          id="journalEntryTags"
          type="text"
          label="Tags"
          onChange={handleTextInputChanged}
          value={journalEntryTags}
          onBlur={handleElementOnBlur}
          customStyles={textFieldSpacingStyle}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon htmlColor="white" />
              </InputAdornment>
            ),
          }}
        />
      </StyledTextFieldDivSection>
      <StyledTextFieldDivSection>
        <StyledTextFieldComponent
          id="journalEntryText"
          multiline
          type="text"
          label="Text"
          fullWidth
          focused
          onBlur={handleElementOnBlur}
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
      </StyledTextFieldDivSection>
    </div>
  ) : (
    <NotFound404 />
  );
}

export default JournalEntryScene;
