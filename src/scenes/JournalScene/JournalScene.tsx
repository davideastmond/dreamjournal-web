import { InputAdornment, Box, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteJournalByIdAsync,
  getAllJournalsForUserAsync,
  selectJournalById,
} from "../../reducers/journal-slice";
import EditIcon from "@mui/icons-material/Edit";
import "./style.css";
import { getFormattedDate } from "../../utils/string-helpers";
import { NotFound404 } from "../NotFound404";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getSessionUserAsync,
  selectSessionUser,
} from "../../reducers/app-slice";
import { ActionDialog } from "../../components/ActionDialog";
import {
  EJournalPatcherField,
  JournalPatcher,
} from "./journal-patch-dispatcher";
import { StyledButtonComponent } from "../../components/StyledButton";
import { pallet } from "../../styling/pallets";
import { StyledHeaderComponent } from "../../components/StyledHeader";
import { StyledTextFieldComponent } from "../../components/StyledTextField";
import { StyledTextFieldDivSection } from "../../components/StyledTextFieldDivSection";
import { StyledReadOnlyPropertiesSection } from "../../components/StyledReadOnlyJournalPropertiesSection";

const StyledJournalBoxContainer = styled(Box)((props) => ({
  [props.theme.breakpoints.up("md")]: {
    marginLeft: "20%",
    marginRight: "20%",
  },
}));
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
    const patcher = new JournalPatcher({ journalId: journalContext?._id });
    switch (element) {
      case "journalTitle":
        await patcher.patch({
          field: EJournalPatcherField.JournalTitle,
          data: journalTitleText!,
        });
        break;
      case "journalDescription":
        await patcher.patch({
          field: EJournalPatcherField.JournalDescription,
          data: journalDescriptionText!,
        });
        break;
      case "journalTags":
        await patcher.patch({
          field: EJournalPatcherField.JournalTags,
          data: rawJournalTagString,
        });
    }
    dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
  };

  return journalContext ? (
    <div className="JournalContext__main">
      <div className="JournalContext__main__backToJournals">
        <Link to="/home">
          <ArrowBackIcon
            sx={{
              padding: "10px",
            }}
          />
        </Link>
        <StyledButtonComponent
          textLabel="Entries"
          onClick={() => {
            navigate(`/journals/${journalId}/entries`);
          }}
        />
      </div>
      <StyledHeaderComponent text={journalContext?.title} sizeVariant="h6" />
      <StyledJournalBoxContainer>
        <StyledTextFieldDivSection>
          <StyledTextFieldComponent
            id="journalTitle"
            type="text"
            label="Title"
            onChange={handleTextInputChanged}
            value={journalTitleText}
            onBlur={handleOnElementOnBlur}
            customInputStyles={{
              padding: "20px",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon htmlColor={pallet.greyDark3} />
                </InputAdornment>
              ),
            }}
          />
        </StyledTextFieldDivSection>
        <StyledTextFieldDivSection>
          <StyledTextFieldComponent
            id="journalDescription"
            type="text"
            label="Description"
            onChange={handleTextInputChanged}
            value={journalDescriptionText}
            onBlur={handleOnElementOnBlur}
            customInputStyles={{
              padding: "20px",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon htmlColor={pallet.greyDark3} />
                </InputAdornment>
              ),
            }}
          />
        </StyledTextFieldDivSection>
        <StyledReadOnlyPropertiesSection>
          <StyledTextFieldDivSection>
            <StyledTextFieldComponent
              label="Created"
              customInputStyles={{
                padding: "20px",
              }}
              value={getFormattedDate({
                dateString: journalContext?.createdAt.toString()!,
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
                dateString: journalContext?.updatedAt.toString()!,
              })}
            />
          </StyledTextFieldDivSection>
          <StyledTextFieldDivSection>
            <StyledTextFieldComponent
              label="id"
              customInputStyles={{
                padding: "20px",
              }}
              value={journalContext?._id}
            />
          </StyledTextFieldDivSection>
        </StyledReadOnlyPropertiesSection>
        <StyledTextFieldDivSection>
          <StyledTextFieldComponent
            id="journalTags"
            type="text"
            label="Tags"
            onChange={handleTextInputChanged}
            value={rawJournalTagString}
            onBlur={handleOnElementOnBlur}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditIcon htmlColor={pallet.greyDark3} />
                </InputAdornment>
              ),
            }}
          />
        </StyledTextFieldDivSection>
        <section className="JournalScene__ControlSection">
          <div>
            <StyledButtonComponent
              onClick={() => setActionDialogOpen(true)}
              variant={"outlined"}
              textLabel="Delete Journal"
              customStyles={{
                backgroundColor: pallet.darkSalmon,
              }}
            />
          </div>
        </section>
      </StyledJournalBoxContainer>
      <ActionDialog
        open={actionDialogOpen}
        promptText={`Are you sure you want to delete journal "${journalContext.title}" ?`}
        onActionConfirmed={handleDeleteJournal}
        onDismiss={() => setActionDialogOpen(false)}
        buttonOptions={[
          <StyledButtonComponent
            onClick={() => setActionDialogOpen(false)}
            textLabel="Cancel"
            fontColor={pallet.darkerSkyBlue}
          />,
          <StyledButtonComponent
            onClick={handleDeleteJournal}
            fontColor={pallet.redText}
            textLabel="Delete"
          />,
        ]}
      />
    </div>
  ) : (
    <NotFound404 />
  );
}
export default JournalScene;
