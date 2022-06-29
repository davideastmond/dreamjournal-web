import { FormGroup, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { ControlledSwitch } from "../../components/ControlledSwitch";
import { getIsTwoFactorAuthenticationEnabled } from "../../services/authentication/authentication.security.service";
import "./style.css";

interface ITwoFactorAuthenticationModuleProps {
  sessionUserId: string;
}
function TwoFactorAuthModule(props: ITwoFactorAuthenticationModuleProps) {
  const [isTwoFactorSetup, setIsTwoFactorSetup] = useState<boolean>(false);
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
    <div>
      <header className="flex justify-center-content">
        <FormGroup>
          <FormControlLabel
            className="black-text"
            control={<ControlledSwitch defaultChecked={isTwoFactorSetup} />}
            label="Two-factor authentication"
          />
        </FormGroup>
      </header>
    </div>
  );
}

export default TwoFactorAuthModule;
