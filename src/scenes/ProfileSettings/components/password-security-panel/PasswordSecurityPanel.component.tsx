import { Grid, FormControl, Typography, styled } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { StyledButtonComponent } from "../../../../components/StyledButton";
import { StyledHeaderComponent } from "../../../../components/StyledHeader";
import { StyledTextFieldComponent } from "../../../../components/StyledTextField";
import { patchUserSecurePassword } from "../../../../services/user/user.service";
import { pallet } from "../../../../styling/pallets";
import { StyledGridItem } from "../styled-grid-item";

const StyledDiv = styled("div")((props) => ({
  "&.security-panel-update-hidden": {
    display: "none",
  },
}));
interface IProfilePanelProps {
  sessionUserId: string | undefined;
  customClasses?: string;
}

function PasswordSecurityPanel(props: IProfilePanelProps) {
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [passwordUpdated, setPasswordUpdated] = useState<boolean>(false);
  const [passwordUpdateError, setPasswordUpdateError] = useState<string | null>(
    null
  );

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
    <StyledDiv className={`${props.customClasses || ""}`}>
      <StyledHeaderComponent text="Security settings" sizeVariant="h5" />
      {!passwordUpdated ? (
        <>
          <Grid container spacing={2}>
            <Grid item sx={{ width: "100%" }}>
              <FormControl sx={{ width: "100%", backgroundColor: "black" }}>
                <StyledGridItem sx={{ backgroundColor: "inherit" }}>
                  <Typography sx={{ color: pallet.eggShellWhite }}>
                    Enter new password
                  </Typography>
                  <StyledTextFieldComponent
                    id="password1"
                    variant="outlined"
                    value={password1}
                    onChange={handlePasswordInputTextChange}
                    textFieldType="password"
                    customStyles={{
                      color: pallet.eggShellWhite,
                    }}
                  />
                </StyledGridItem>
                <StyledGridItem sx={{ backgroundColor: "inherit" }}>
                  <Typography sx={{ color: pallet.eggShellWhite }}>
                    Confirm new password
                  </Typography>
                  <StyledTextFieldComponent
                    id="password2"
                    variant="outlined"
                    value={password2}
                    onChange={handlePasswordInputTextChange}
                    textFieldType="password"
                  />
                </StyledGridItem>
              </FormControl>
            </Grid>
          </Grid>
          <footer className="top-margin-buffer">
            <div className="validation-message"></div>
            <StyledButtonComponent
              textLabel="Save"
              disabled={!passwordValidationRules}
              onClick={submitPasswordUpdate}
              fillColor={pallet.aquaBlueGreen}
              fontColor={pallet.eggShellWhite}
            />
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
    </StyledDiv>
  );
}

export default PasswordSecurityPanel;
