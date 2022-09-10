import {
  FormGroup,
  FormControlLabel,
  Button,
  Snackbar,
  Alert,
  Box,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ControlledSwitch } from "../../components/ControlledSwitch";
import { getIsTwoFactorAuthenticationEnabled } from "../../services/authentication/authentication.security.service";

import "react-phone-number-input/style.css";
import "./style.css";
import { TwoFactorEnroll } from "../../components/TwoFactorEnroll";
import { useNavigate } from "react-router-dom";
import { enrollTFA } from "../../services/authentication/authentication.security.tfa.service";
import { TFADeactivationConfirmationDialog } from "../../components/TFADeactivationConfirmationDialog";
import { StyledHeaderComponent } from "../../components/StyledHeader";
import { pallet } from "../../styling/pallets";
import { StyledBoxContainer } from "../../components/StyledBoxContainer";

interface ITwoFactorAuthenticationModuleProps {
  sessionUserId: string;
}

const StyledFormControlLabel = styled(FormControlLabel)((props) => ({
  "&.MuiFormControlLabel-root": {
    color: pallet.eggShellWhite,
  },
}));

const StyledDiv = styled("div")((props) => ({
  marginTop: "10px",
  marginBottom: "10px",
}));

function TwoFactorAuthModule(props: ITwoFactorAuthenticationModuleProps) {
  const [isTwoFactorSetup, setIsTwoFactorSetup] = useState<boolean>(false);
  const [isTwoFactorChecked, setIsTwoFactorChecked] = useState<boolean>(false);
  const [isTFASliderDisabled, setIsTFASliderDisabled] =
    useState<boolean>(false);
  const [tfaCancelDialogOpen, setTfaCancelDialogOpen] =
    useState<boolean>(false);
  const [successToastOpen, setSuccessToastOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  const handle2faCheckedStatus = (status: boolean) => {
    setIsTwoFactorChecked(status);
  };

  const handleTwoFactorEnrollClicked = async ({
    ctnData,
  }: {
    ctnData?: string;
  }) => {
    if (!ctnData) return;
    try {
      const tfaEnrollResponse = await enrollTFA({
        userId: props.sessionUserId,
        ctn: ctnData,
      });
      navigate("/tfa/verify", {
        state: { token: tfaEnrollResponse.token, isEnrolling: true },
      });
    } catch (exception: any) {
      console.log(exception.message);
    }
  };

  const checkIfTwoFactorAuthenticationEnabled = async () => {
    try {
      const data = await getIsTwoFactorAuthenticationEnabled({
        userId: props.sessionUserId,
      });
      setIsTwoFactorSetup(data.twoFactorAuthentication.enabled);
      setIsTFASliderDisabled(data.twoFactorAuthentication.enabled);
    } catch (exception: any) {
      console.log(exception.message);
    }
  };

  const handleCloseOnSuccess = () => {
    setTfaCancelDialogOpen(false);
    checkIfTwoFactorAuthenticationEnabled();
    setSuccessMessage("TFA has been disabled successfully");
    setSuccessToastOpen(true);
  };

  useEffect(() => {
    checkIfTwoFactorAuthenticationEnabled();
  }, []);

  const getSwitchLabel = (): string => {
    if (isTwoFactorChecked) return "ON";
    if (isTwoFactorSetup) return "ON";
    return "OFF";
  };
  return (
    <StyledBoxContainer>
      <FormGroup>
        <StyledHeaderComponent
          text="Two-factor auth settings"
          sizeVariant="h4"
        />
        <StyledDiv className="flex justify-center-content">
          <StyledFormControlLabel
            control={
              <ControlledSwitch
                defaultChecked={isTwoFactorSetup}
                onStateChange={handle2faCheckedStatus}
                defaultDisabled={isTFASliderDisabled}
              />
            }
            label={getSwitchLabel()}
          />
        </StyledDiv>
        {!isTwoFactorSetup && isTwoFactorChecked && (
          <TwoFactorEnroll onEnrollClicked={handleTwoFactorEnrollClicked} />
        )}
        {isTwoFactorSetup && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setTfaCancelDialogOpen(true)}
          >
            Disable 2FA
          </Button>
        )}
      </FormGroup>
      <TFADeactivationConfirmationDialog
        onDialogCancel={() => setTfaCancelDialogOpen(false)}
        sessionUserId={props.sessionUserId}
        onSuccess={handleCloseOnSuccess}
        open={tfaCancelDialogOpen}
      />
      <Snackbar open={successToastOpen} autoHideDuration={6000}>
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </StyledBoxContainer>
  );
}

export default TwoFactorAuthModule;
