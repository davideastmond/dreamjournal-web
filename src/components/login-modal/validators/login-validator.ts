import { isEmailValid } from "../../../utils/string-helpers";

type TLoginValidationInput = {
  email: string;
  password: string;
  onSuccess: () => void;
  onFail: ({
    field,
    message,
  }: {
    field: "email" | "password" | "unknown";
    message: string;
  }) => void;
};

export function validateLoginData({
  email,
  password,
  onSuccess,
  onFail,
}: TLoginValidationInput): void {
  let foundError = false;
  if (!email) {
    foundError = true;
    onFail({ field: "email", message: "Enter an e-mail" });
  }
  if (!isEmailValid({ email })) {
    foundError = true;
    onFail({ field: "email", message: "Please enter a valid e-mail address" });
  }

  if (!password || password.trim() === "") {
    foundError = true;
    onFail({
      field: "password",
      message: "Enter a password that is at least 8 characters long",
    });
  }

  if (!foundError) {
    onSuccess();
  } else {
    onFail({ field: "unknown", message: "Unknown validation error" });
  }
}
