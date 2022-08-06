import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";

interface ITwoFactorValidateProps {
  token: string;
  onVerifyButtonClicked?: (authCode: string | number) => void;
}

/**
 * Basically an input box allowing user to enter the code
 * A submit button
 * @returns JSX Element
 */
function TwoFactorValidate(props: ITwoFactorValidateProps) {
  const [authCodeEntered, setAuthCodeEntered] = useState<
    string | number | null
  >(null);
  const handleVerifyButtonClicked = () => {
    props.onVerifyButtonClicked &&
      props.onVerifyButtonClicked(authCodeEntered as string);
  };
  return (
    <div className="TwoFactorValidate__main">
      <div>
        <TextField
          required
          id="authCode"
          label="Authorization Code"
          type="number"
          placeholder="code"
          onChange={(e) => setAuthCodeEntered(e.target.value)}
        />
      </div>
      <div>
        <LoadingButton
          onClick={handleVerifyButtonClicked}
          loading={true}
          variant="contained"
        >
          Verify
        </LoadingButton>
      </div>
    </div>
  );
}

export default TwoFactorValidate;
