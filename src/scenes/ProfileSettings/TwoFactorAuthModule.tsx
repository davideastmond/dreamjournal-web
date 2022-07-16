import { FormGroup, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { ControlledSwitch } from "../../components/ControlledSwitch";
import { getIsTwoFactorAuthenticationEnabled } from "../../services/authentication/authentication.security.service";

import "react-phone-number-input/style.css";
import "./style.css";
import { TwoFactorEnroll } from "../../components/TwoFactorEnroll";
import { useNavigate } from "react-router-dom";
import { enrollTFA } from "../../services/authentication/authentication.security.tfa.service";

interface ITwoFactorAuthenticationModuleProps {
  sessionUserId: string;
}
function TwoFactorAuthModule(props: ITwoFactorAuthenticationModuleProps) {
  const [isTwoFactorSetup, setIsTwoFactorSetup] = useState<boolean>(false);
  const [isTwoFactorChecked, setIsTwoFactorChecked] = useState<boolean>(false);
  const navigate = useNavigate();

  const handle2faCheckedStatus = (status: boolean) => {
    console.log(status);
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
        state: { token: tfaEnrollResponse.token, enroll: true },
      });
    } catch (exception: any) {
      console.log(exception.message);
    }
  };

  useEffect(() => {
    const checkIfTwoFactorAuthenticationEnabled = async () => {
      try {
        const data = await getIsTwoFactorAuthenticationEnabled({
          userId: props.sessionUserId,
        });
        setIsTwoFactorSetup(data.twoFactorAuthentication.enabled);
      } catch (exception: any) {
        console.log(exception.message);
      }
    };
    checkIfTwoFactorAuthenticationEnabled();
  }, []);

  return (
    <div className="flex justify-center-content">
      <FormGroup>
        <FormControlLabel
          className="black-text"
          control={
            <ControlledSwitch
              defaultChecked={isTwoFactorSetup}
              onStateChange={handle2faCheckedStatus}
            />
          }
          label="Two-factor authentication"
        />

        {(isTwoFactorSetup || isTwoFactorChecked) && (
          <TwoFactorEnroll onEnrollClicked={handleTwoFactorEnrollClicked} />
        )}
      </FormGroup>
    </div>
  );
}

export default TwoFactorAuthModule;
