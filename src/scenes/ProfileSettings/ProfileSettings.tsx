import { Tab, Tabs, styled } from "@mui/material";
import React, { useState } from "react";
import { TabPanel } from "../../components/tab-panel";

import { useSelector, shallowEqual } from "react-redux";
import { selectSessionUser } from "../../reducers/app-slice";
import "./style.css";

import { Spinner } from "../../components/Spinner";
import { PersonalPanel } from "./PersonalPanel";
import TwoFactorAuthModule from "./TwoFactorAuthModule";
import { pallet } from "../../styling/pallets";

import { PasswordSecurityPanel } from "./components/password-security-panel";
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StyledTab = styled(Tabs)(() => ({
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

const StyledTabPanel = styled(TabPanel)((props) => ({
  [props.theme.breakpoints.up("md")]: {
    "& .MuiBox-root": {
      display: "flex",
      justifyContent: "space-evenly",
    },
  },
}));

function ProfileSettings() {
  const [value, setValue] = useState<number>(0);
  const sessionUser = useSelector(selectSessionUser, shallowEqual);
  const [isUpdateMode] = useState<boolean>(false);
  const [isDoingNetworkRequest] = useState<boolean>(false);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
      <StyledTabPanel value={value} index={1}>
        <PasswordSecurityPanel
          sessionUserId={sessionUser?._id}
          customClasses={`${
            isUpdateMode ? "security-panel-update-hidden" : ""
          }`}
        />
      </StyledTabPanel>
      <TabPanel value={value} index={2}>
        {sessionUser && <TwoFactorAuthModule sessionUserId={sessionUser._id} />}
      </TabPanel>
    </div>
  );
}

export default ProfileSettings;
