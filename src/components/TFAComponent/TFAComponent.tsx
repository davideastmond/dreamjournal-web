import { LoadingButton } from "@mui/lab";
import { Container, TextField } from "@mui/material";
import { useState } from "react";
import { AppLogo } from "../AppLogo";
import "./style.css";
interface ITFAComponentProps {
  token: string;
  onConfirmClick?: ({
    tfaToken,
    authCode,
  }: {
    tfaToken: string;
    authCode: string;
  }) => void;
}
function TFAComponent(props: ITFAComponentProps) {
  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifyButtonDisabled, setIsVerifyButtonDisabled] =
    useState<boolean>(true);
  const [errText, setErrText] = useState<string | null>(null);

  const handleConfirmButtonClick = () => {
    if (code && code.length === 6) {
      setIsLoading(true);
      props.onConfirmClick &&
        props.onConfirmClick({ tfaToken: props.token, authCode: code });
    } else {
      setErrText(
        "The data you entered is not valid: Please enter a valid authorization code"
      );
    }
  };

  const handleNumericCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCode(event.target.value);
    const validExpression = /^[0-9]*$/;
    if (!event.target.value) {
      setIsVerifyButtonDisabled(true);
      return;
    }

    if (!validExpression.test(event.target.value)) {
      setIsVerifyButtonDisabled(true);
      return;
    }

    if (
      validExpression.test(event.target.value) &&
      event.target.value.length === 6
    ) {
      setErrText(null);
      setIsVerifyButtonDisabled(false);
      return;
    }

    setIsVerifyButtonDisabled(true);
  };
  return (
    <div
      className="tfaComponent__main"
      style={{ backgroundColor: "white", padding: "2%" }}
    >
      <AppLogo />
      <header>
        <p className="font-color-black">
          Please enter the one-time verification code
        </p>
      </header>
      <div className="TFAComponent__tfaTextField__enclosure">
        <TextField
          inputProps={{ pattern: "^[0-9]*$" }}
          sx={{ textAlign: "center" }}
          variant="standard"
          onChange={handleNumericCodeChange}
        />
      </div>
      <footer className="top-margin-buffer">
        <LoadingButton
          loading={isLoading}
          onClick={handleConfirmButtonClick}
          variant="contained"
          disabled={isVerifyButtonDisabled}
        >
          Verify
        </LoadingButton>
      </footer>
      {errText && (
        <footer>
          <p className="red-text">{errText}</p>
        </footer>
      )}
    </div>
  );
}

export default TFAComponent;
