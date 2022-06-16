import { Button, Grid, Tab, Tabs, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { TabPanel } from "../../components/tab-panel/TapPanel";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getAvailableSecurityQuestionsAsync,
  patchUserBasicProfileDataAsync,
  selectSessionUser,
} from "../../reducers/app-slice";
import "./style.css";
import {
  createNewUserSecurityQuestions,
  patchUserSecurePassword,
} from "../../services/user/user.service";
import { Link } from "react-router-dom";
import {
  SecurityQuestionPrompter,
  SecurityQuestionSelector,
} from "../../components/SecurityQuestion";
import { getSecurityQuestionsForUserByUserId } from "../../services/authentication/authentication.security.service";
import {
  TNewSecurityQuestionDataSubmission,
  TSecurityQuestionTemplate,
} from "../../services/authentication/authentication.types";
import { Spinner } from "../../components/Spinner";

interface IProfilePanelProps {
  sessionUserId: string | undefined;
}
const Item = styled(Paper)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const GridRow = ({
  canEdit,
  label,
  contentData,
  onEdit,
  idTag,
}: {
  canEdit: boolean;
  label: string;
  contentData?: string;
  onEdit?: (value: string) => void;
  idTag?: string;
}) => {
  const handleOnTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onEdit && onEdit(event.target.value);
  };

  return (
    <>
      <Grid item xs={6}>
        <Item>{label}</Item>
      </Grid>
      {canEdit ? (
        <Grid item xs={6}>
          <Item>
            <TextField
              variant="outlined"
              value={contentData}
              onChange={handleOnTextInputChange}
              id={idTag}
            />
          </Item>
        </Grid>
      ) : (
        <Grid item xs={6}>
          <Item>{contentData}</Item>
        </Grid>
      )}
    </>
  );
};

function PersonalPanel({
  email,
  firstName,
  lastName,
  sessionUserId,
}: {
  email: string;
  firstName: string;
  lastName: string;
  sessionUserId: string | undefined;
}) {
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [firstNameTextData, setFirstNameTextData] = useState<string>(firstName);
  const [lastNameTextData, setLastNameTextData] = useState<string>(lastName);
  const dispatch = useDispatch();

  const handleSubmitPersonalData = () => {
    if (sessionUserId) {
      dispatch(
        patchUserBasicProfileDataAsync({
          firstName: firstNameTextData,
          lastName: lastNameTextData,
          userId: sessionUserId,
        })
      );
      setCanEdit(false);
    }
  };

  const originalFirstNameDataRef = useRef(firstName);
  const originalLastNameDataRef = useRef(lastName);
  const handleCancelEdit = () => {
    setCanEdit(!canEdit);
    setFirstNameTextData(originalFirstNameDataRef.current);
    setLastNameTextData(originalLastNameDataRef.current);

    const firstNameTextBox = document.getElementById(
      "firstname"
    ) as HTMLInputElement;
    const lastNameTextBox = document.getElementById(
      "lastname"
    ) as HTMLInputElement;
    firstNameTextBox.value = originalFirstNameDataRef.current;
    lastNameTextBox.value = originalLastNameDataRef.current;
  };
  return (
    <div>
      <Typography sx={{ color: "black" }}>Basic personal info</Typography>
      <Grid container spacing={2}>
        <GridRow canEdit={false} label="E-mail" contentData={email} />
        <GridRow
          canEdit={canEdit}
          label="First Name"
          contentData={firstNameTextData}
          onEdit={setFirstNameTextData}
          idTag="firstname"
        />
        <GridRow
          canEdit={canEdit}
          label="Last Name"
          contentData={lastNameTextData}
          onEdit={setLastNameTextData}
          idTag="lastname"
        />
      </Grid>
      <footer className="top-margin-buffer">
        {canEdit ? (
          <Button variant="outlined" color="error" onClick={handleCancelEdit}>
            Cancel edit
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="success"
            onClick={() => setCanEdit(!canEdit)}
          >
            Edit
          </Button>
        )}
        {canEdit && (
          <Button variant="outlined" onClick={handleSubmitPersonalData}>
            Save
          </Button>
        )}
      </footer>
    </div>
  );
}

function PasswordSecurityPanel(props: IProfilePanelProps) {
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [passwordUpdated, setPasswordUpdated] = useState<boolean>(false);
  const [passwordUpdateError, setPasswordUpdateError] = useState<string | null>(
    null
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAvailableSecurityQuestionsAsync());
  }, []);

  const handlePasswordInputTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const targetId = event.target.id;
    switch (targetId) {
      case "password1":
        setPassword1(event.target.value);
        break;
      case "password2":
        setPassword2(event.target.value);
    }
  };

  const submitPasswordUpdate = async () => {
    if (props.sessionUserId) {
      try {
        await patchUserSecurePassword({
          password: password1,
          userId: props.sessionUserId,
        });
        setPasswordUpdated(true);
      } catch (exception) {
        setPasswordUpdateError("Unable to perform password update");
      }
    }
  };

  const passwordValidationRules =
    password1.length > 5 && password2.length > 5 && password1 === password2;

  return (
    <div className="container-flex flex justify-center-content-responsive">
      <div>
        <Typography sx={{ color: "black" }}>Security settings</Typography>
        {!passwordUpdated ? (
          <>
            <Grid container spacing={2}>
              <Grid item>
                <Item>
                  <Typography>Enter new password</Typography>
                  <TextField
                    id="password1"
                    variant="outlined"
                    value={password1}
                    onChange={handlePasswordInputTextChange}
                    type="password"
                  />
                </Item>
                <Item>
                  <Typography>Confirm new password</Typography>
                  <TextField
                    id="password2"
                    variant="outlined"
                    value={password2}
                    onChange={handlePasswordInputTextChange}
                    type="password"
                  />
                </Item>
              </Grid>
            </Grid>
            <footer className="top-margin-buffer">
              <div className="validation-message"></div>
              <Button
                variant="outlined"
                disabled={!passwordValidationRules}
                onClick={submitPasswordUpdate}
              >
                Save
              </Button>
              {passwordUpdateError && (
                <>
                  <Typography>{passwordUpdateError}</Typography>
                </>
              )}
            </footer>
          </>
        ) : (
          <>
            <Typography> Password has been updated </Typography>
            <Link to="/settings">Back to settings</Link>
          </>
        )}
      </div>
    </div>
  );
}

function ProfileSettings() {
  const [value, setValue] = useState<number>(0);
  const sessionUser = useSelector(selectSessionUser, shallowEqual);
  const [hasSecurityQuestionsSet, setHasSecurityQuestionsSet] =
    useState<boolean>(false);
  const [securityQuestionData, setSecurityQuestionData] = useState<{
    isSet: boolean;
    questions: TSecurityQuestionTemplate[];
  } | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
  const [isDoingNetworkRequest, setIsDoingNetworkRequest] =
    useState<boolean>(false);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getRefreshSecurityQuestions = async () => {
    if (sessionUser) {
      setIsDoingNetworkRequest(true);
      const data = await getSecurityQuestionsForUserByUserId({
        userId: sessionUser?._id,
      });
      setHasSecurityQuestionsSet(data.isSet);
      setSecurityQuestionData(data);
      setIsDoingNetworkRequest(false);
      setIsUpdateMode(false);
    }
  };

  useEffect(() => {
    getRefreshSecurityQuestions();
  }, []);

  const handleSubmitNewSecurityQuestions = async (
    data: TNewSecurityQuestionDataSubmission
  ) => {
    if (!sessionUser) return;
    try {
      await createNewUserSecurityQuestions({
        userId: sessionUser._id,
        data,
      });
      getRefreshSecurityQuestions();
    } catch (exception: any) {
      console.log(exception.message);
      setIsDoingNetworkRequest(false);
    }
  };
  const handlePrompterEditButtonClick = () => {
    setIsUpdateMode(true);
  };
  return (
    <div style={{ backgroundColor: "white " }}>
      {isDoingNetworkRequest && <Spinner />}
      <header>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Personal Details" {...a11yProps(0)} />
          <Tab label="Password and security" {...a11yProps(1)} />
        </Tabs>
      </header>
      <TabPanel value={value} index={0}>
        <PersonalPanel
          email={sessionUser?.email || "no e-mail"}
          firstName={sessionUser?.firstName || "no first name"}
          lastName={sessionUser?.lastName || "no last name"}
          sessionUserId={sessionUser?._id}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PasswordSecurityPanel sessionUserId={sessionUser?._id} />
        <div className="security-question-section top-divider-border">
          <section>
            {hasSecurityQuestionsSet &&
              securityQuestionData &&
              !isUpdateMode && (
                <SecurityQuestionPrompter
                  data={securityQuestionData}
                  editButtonVisible={true}
                  onEditButtonClick={handlePrompterEditButtonClick}
                />
              )}
            {!hasSecurityQuestionsSet && !isUpdateMode && (
              <SecurityQuestionSelector
                onSaveSubmit={handleSubmitNewSecurityQuestions}
              />
            )}
            {hasSecurityQuestionsSet && isUpdateMode && (
              <SecurityQuestionSelector
                onSaveSubmit={handleSubmitNewSecurityQuestions}
                existingQuestions={
                  securityQuestionData
                    ? securityQuestionData.questions.map((q) => q.prompt)
                    : []
                }
              />
            )}
          </section>
          <footer></footer>
        </div>
      </TabPanel>
    </div>
  );
}

export default ProfileSettings;
