import {
  Button,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
  FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TabPanel } from "../../components/tab-panel/TapPanel";

import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getAvailableSecurityQuestionsAsync,
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
import { Item } from "./Item";
import { PersonalPanel } from "./PersonalPanel";
import TwoFactorAuthModule from "./TwoFactorAuthModule";
import { pallet } from "../../styling/pallets";
import { StyledHeaderComponent } from "../../components/StyledHeader";

interface IProfilePanelProps {
  sessionUserId: string | undefined;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StyledTab = styled(Tabs)((props) => ({
  "& .MuiTab-root.Mui-selected": {
    color: pallet.lightSalmon,
    fontWeight: "600",
  },
  "& .MuiTab-root.Mui-disabled": {
    fontStyle: "italic",
    color: pallet.greyDark2,
    fontWeight: "300",
  },
  "& .MuiTab-root": {
    color: pallet.greyDark3,
    fontWeight: "100",
  },
  "& .MuiTabs-indicator": {
    backgroundColor: pallet.lightSalmon,
  },
}));
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
        <StyledHeaderComponent text="Security settings" sizeVariant="h5" />
        {!passwordUpdated ? (
          <>
            <Grid container spacing={2}>
              <Grid item>
                <FormControl>
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
                </FormControl>
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

  const handleSecurityQuestionSelectorCancelClicked = () => {
    setIsUpdateMode(false);
  };
  return (
    <div style={{ backgroundColor: "black" }}>
      {isDoingNetworkRequest && <Spinner />}
      <StyledTab
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Personal Details" {...a11yProps(0)} />
        <Tab label="Password and security" {...a11yProps(1)} />
        <Tab label="2FA" {...a11yProps(2)} disabled={true} />
      </StyledTab>
      <TabPanel value={value} index={0}>
        <PersonalPanel
          email={sessionUser?.email || "no e-mail"}
          firstName={sessionUser?.firstName || "no first name"}
          lastName={sessionUser?.lastName || "no last name"}
          dateOfBirth={sessionUser?.dateOfBirth?.toString() || "unspecified"}
          sessionUserId={sessionUser?._id}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PasswordSecurityPanel sessionUserId={sessionUser?._id} />
        <div className="security-question-section top-divider-border">
          <StyledHeaderComponent text="Security questions" sizeVariant="h5" />
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
                onCancelClicked={handleSecurityQuestionSelectorCancelClicked}
              />
            )}
            {hasSecurityQuestionsSet && isUpdateMode && (
              <SecurityQuestionSelector
                onSaveSubmit={handleSubmitNewSecurityQuestions}
                onCancelClicked={handleSecurityQuestionSelectorCancelClicked}
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
      <TabPanel value={value} index={2}>
        {sessionUser && <TwoFactorAuthModule sessionUserId={sessionUser._id} />}
      </TabPanel>
    </div>
  );
}

export default ProfileSettings;
