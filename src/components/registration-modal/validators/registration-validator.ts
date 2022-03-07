import { isEmailValid } from "../../../utils/string-helpers";

type TRegistrationValidationInput = {
  email: string, 
  firstName: string,
  lastName: string,
  password1: string,
  password2: string
  onSuccess: ()=> void,
  onFail: ({ field, message}: { field: "email" | "firstName" | "lastName" | "password1" | "password2" | "unknown", message: string}) => void
}

export function validateRegistrationData({ email, firstName, lastName, password1, password2, onSuccess, onFail}: TRegistrationValidationInput): void {
  let foundError = false;
  if (!email) {
    foundError = true;
    onFail({ field: "email", message: "Enter an e-mail"});
  }
  if (!isEmailValid({ email })) {
    foundError = true;
    onFail({ field: "email", message: "Please enter a valid e-mail address"});
  }
  if (!firstName || firstName.trim() === "") {
    foundError = true;
    onFail({ field: "firstName", message: "Please enter a first name"});
  }
  if (!lastName || lastName.trim() === "") {
    foundError = true;
    onFail({ field: "lastName", message: "Please enter a last name"});
  }

  if (!password1 ||  password1.trim() === "") {
    foundError = true;
    onFail({ field: "password1", message: "Enter a password that is at least 8 characters long" });
  }
  if (password2.trim() !== password1.trim() || password2.trim() === "") {
    foundError = true;
    onFail({ field: "password2", message: "Please confirm password, and ensure passwords match"});
  }

  if (!foundError) {
    onSuccess();
  } else {
    onFail({ field: "unknown", message: "Unknown validation error"})
  }
}
