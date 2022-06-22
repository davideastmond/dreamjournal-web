import { FormGroup, FormControlLabel } from "@mui/material";
import { ControlledSwitch } from "../../components/ControlledSwitch";
import "./style.css";

function TwoFactorAuthModule() {
  return (
    <div>
      <header className="flex justify-center-content">
        <FormGroup>
          <FormControlLabel
            className="black-text"
            control={<ControlledSwitch />}
            label="Two-factor authentication"
          />
        </FormGroup>
      </header>
    </div>
  );
}

export default TwoFactorAuthModule;
