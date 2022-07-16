import InternationalNumberInput, {
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import { Button } from "@mui/material";
import React, { useState } from "react";
import "./style.css";
import "react-phone-number-input/style.css";

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
    <>
      <section>
        <header>
          <p className="font-color-black">Enter your phone number</p>
        </header>
        <>
          <InternationalNumberInput
            onChange={handle2faNumberChange}
            placeholder="Enter phone number"
            value={phoneNumber2fa || undefined}
          />
        </>
        <div className="TwoFactorSubmission__enrollButtonSection__main">
          <Button
            variant="outlined"
            size="small"
            disabled={!isPhoneNumberValid}
            onClick={handleEnrollClicked}
          >
            Enroll
          </Button>
        </div>
        <footer className="errorMessagesText"></footer>
      </section>
    </>
  );
}

export default TwoFactorEnroll;
