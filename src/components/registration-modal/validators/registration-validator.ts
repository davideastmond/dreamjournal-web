import { isEmailValid } from "../../../utils/string-helpers";
import { isPasswordValid } from "../../../utils/validators/validators";

type TRegistrationValidationInput = {
  email: string;
  firstName: string;
  lastName: string;
  password1: string;
  password2: string;
  dateOfBirth: Date;
  onSuccess: () => void;
  onFail: ({
    field,
    message,
  }: {
    field:
      | "email"
      | "firstName"
      | "lastName"
      | "password1"
      | "password2"
      | "dateOfBirth"
      | "unknown"
      | string;
    message: string;
  }) => void;
};

export function validateRegistrationData({
  email,
  firstName,
  lastName,
  password1,
  password2,
  dateOfBirth,
  onSuccess,
  onFail,
}: TRegistrationValidationInput): void {
  let foundError = false;
  if (!email) {
    foundError = true;
    onFail({ field: "email", message: "Enter an e-mail" });
  }
  if (!isEmailValid({ email })) {
    foundError = true;
    onFail({ field: "email", message: "Please enter a valid e-mail address" });
  }
  if (!firstName || firstName.trim() === "") {
    foundError = true;
    onFail({ field: "firstName", message: "Please enter a first name" });
  }
  if (!lastName || lastName.trim() === "") {
    foundError = true;
    onFail({ field: "lastName", message: "Please enter a last name" });
  }

  if (!dateOfBirth) {
    foundError = true;
    onFail({ field: "dateOfBirth", message: "Please enter a date of birth" });
  }

  const passwordFailMessage = ({
    field,
    message,
  }: {
    field: string;
    message: string;
  }) => {
    foundError = true;
    onFail({
      field,
      message,
    });
  };
  isPasswordValid({ password1, password2, onFail: passwordFailMessage });

  if (!foundError) {
    onSuccess();
  } else {
    onFail({ field: "unknown", message: "Unknown validation error" });
  }
}
