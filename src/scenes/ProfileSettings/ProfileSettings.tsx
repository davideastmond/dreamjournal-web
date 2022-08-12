import { Tab, Tabs, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TabPanel } from "../../components/tab-panel/TapPanel";

import { useSelector, shallowEqual } from "react-redux";
import { selectSessionUser } from "../../reducers/app-slice";
import "./style.css";
import { createNewUserSecurityQuestions } from "../../services/user/user.service";
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
import { PersonalPanel } from "./PersonalPanel";
import TwoFactorAuthModule from "./TwoFactorAuthModule";
import { pallet } from "../../styling/pallets";
import { StyledHeaderComponent } from "../../components/StyledHeader";

import { PasswordSecurityPanel } from "./components/password-security-panel";
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
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        {sessionUser && <TwoFactorAuthModule sessionUserId={sessionUser._id} />}
      </TabPanel>
    </div>
  );
}

export default ProfileSettings;
