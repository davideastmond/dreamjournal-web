import {
  ButtonBase,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllJournalsForUserAsync,
  selectJournalEntryById,
} from "../../reducers/journal-slice";
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
import { StyledBoxContainer } from "../../components/StyledBoxContainer";
import { CustomDatePicker } from "../../components/CustomDatePicker";
import { pallet } from "../../styling/pallets";
import CloseIcon from "@mui/icons-material/Close";
import { StyledCheckBox } from "../../components/StyledCheckBox";

/**
 * Title, description, text, created, updated, tags, entryDate, lucid
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

  const [journalEntryDate, setJournalEntryDate] = useState<any>(
    journalEntryContext?.entryDate?.toString() || ""
  );
  const [isTextEntryFullScreenMode, setIsTextEntryFullScreenMode] =
    useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);
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

  // Handle journal entry date changing
  const handleJournalEntryDateCalendarChanged = async (value: any) => {
    setJournalEntryDate(value);

    // User uses date picker to set a date. Extract the ISO date string
    if (!journalId || !journalEntryId || !sessionUser) return;
    const entryDateData = value?.$d?.toISOString();

    try {
      if (entryDateData) {
        await patchJournalEntry({
          journalId,
          journalEntryId,
          patchObject: {
            entryDate: { action: "update", data: entryDateData },
          },
        });
        dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
      }
    } catch (exception: any) {
      // POIJ do something with this error
      console.error(exception.message);
    }
  };

  // Lucid checkbox.
  const handleLucidCheckboxChange = async (checked: boolean) => {
    // When this event is received, we should send a request to update this journalEntry context
    if (!journalId || !journalEntryId || !sessionUser) return;
    try {
      await patchJournalEntry({
        journalId,
        journalEntryId,
        patchObject: {
          lucid: { action: "update", data: checked },
        },
      });
      dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
    } catch (exception: any) {
      // POIJ do something with this error
      console.error(exception.message);
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

  const handleSmallTextBoxClick = (e: any) => {
    // Open full-screen mode
    if (window.innerWidth <= 600) {
      if (!isTextEntryFullScreenMode) setIsTextEntryFullScreenMode(true);
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
      {isTextEntryFullScreenMode && (
        <>
          <StyledFullScreenTextComponent
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
              startAdornment: (
                <ButtonBase onClick={() => setIsTextEntryFullScreenMode(false)}>
                  <CloseIcon htmlColor={pallet.eggShellWhite} />
                </ButtonBase>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon htmlColor="white" />
                </InputAdornment>
              ),
            }}
          />
        </>
      )}
      <StyledHeaderComponent text="Journal Entry" sizeVariant="h6" />
      <StyledBoxContainer>
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
              readOnly: true,
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
          <CustomDatePicker
            label="Entry Date"
            lightText
            defaultDate={journalEntryContext.entryDate}
            calendarIconColor={pallet.white}
            onDateChange={handleJournalEntryDateCalendarChanged}
            readOnly
            disableFuture
          />
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
        <div>
          {/* This is for the lucid checkbox */}
          <StyledCheckBox
            label="Lucid"
            onChange={handleLucidCheckboxChange as any}
            defaultChecked={journalEntryContext.attributes.lucid}
          />
        </div>
        {!isTextEntryFullScreenMode && (
          <StyledTextFieldDivSection>
            <StyledTextFieldComponent
              id="journalEntryText"
              multiline
              type="text"
              label="Text"
              fullWidth
              onBlur={handleElementOnBlur}
              onChange={handleTextInputChanged}
              value={journalEntryText}
              rows={6}
              onClick={handleSmallTextBoxClick}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EditIcon htmlColor="white" />
                  </InputAdornment>
                ),
              }}
            />
          </StyledTextFieldDivSection>
        )}
      </StyledBoxContainer>
    </div>
  ) : (
    <NotFound404 />
  );
}

export default JournalEntryScene;

const textFieldSpacingStyle = {
  marginTop: "10px",
  marginBottom: "10px",
};

const StyledFullScreenTextComponent = styled(StyledTextFieldComponent)(
  ({ ...props }) => ({
    [props.theme.breakpoints.down("sm")]: {
      "&.MuiTextField-root": {
        position: "absolute",
        zIndex: 3,
        left: "0px",
        backgroundColor: pallet.black,
        display: "block",
        top: "60px",
      },
      "&& .MuiInputBase-inputMultiline": {
        height: "70vh !important",
      },
    },
  })
);
