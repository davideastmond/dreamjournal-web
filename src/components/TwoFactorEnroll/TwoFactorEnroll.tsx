import InternationalNumberInput, {
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import { useState } from "react";
import "./style.css";
import "react-phone-number-input/style.css";
import { StyledHeaderComponent } from "../StyledHeader";
import { StyledButtonComponent } from "../StyledButton";
import { styled } from "@mui/material";
import { pallet } from "../../styling/pallets";

const CustomStyledButtonComponent = styled(StyledButtonComponent)(
  ({ theme, ...props }) => ({
    "&.Mui-disabled": {
      color: pallet.greyDark1,
      border: `2px solid ${pallet.greyDark1}`,
    },
  })
);
interface ITwoFactorEnrollProps {
  onEnrollClicked?: ({ ctnData }: { ctnData?: string }) => void;
}
function TwoFactorEnroll(props: ITwoFactorEnrollProps) {
  const [phoneNumber2fa, setPhoneNumber2fa] = useState<
    string | null | undefined
  >(null);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean>(false);

  const handle2faNumberChange = (value: string) => {
    const phoneNumberValid = isPossiblePhoneNumber((value as string) || "");
    setIsPhoneNumberValid(phoneNumberValid);
    setPhoneNumber2fa(value);
  };

  const handleEnrollClicked = () => {
    if (phoneNumber2fa) {
      props.onEnrollClicked &&
        props.onEnrollClicked({ ctnData: phoneNumber2fa });
    } else {
      // POIJ Do some error validation and UI
      console.log(`${phoneNumber2fa} is not a valid number`);
    }
  };

  return (
    <div>
      <StyledHeaderComponent
        text="Enter your phone number"
        sizeVariant="h6"
        headerEnclosureStylings={{ marginBottom: "10px" }}
      />
      <div>
        <InternationalNumberInput
          onChange={handle2faNumberChange}
          placeholder="Enter phone number"
          value={phoneNumber2fa || undefined}
          className="numberInput__Section"
        />
      </div>
      <div className="TwoFactorSubmission__enrollButtonSection__main">
        <CustomStyledButtonComponent
          variant="outlined"
          disabled={!isPhoneNumberValid}
          onClick={handleEnrollClicked}
          textLabel="Enroll"
        />
      </div>
      <footer className="errorMessagesText"></footer>
    </div>
  );
}

export default TwoFactorEnroll;
