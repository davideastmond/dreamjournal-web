import { TBaseServiceRequest } from "../services.types";

export type TRegistrationRequestDetails = {
  firstName: string;
  lastName: string;
  email: string;
  plainTextPassword: string;
  dateOfBirth: string;
} & TBaseServiceRequest;

export type TRegistrationResponseData = {
  token: string;
  issued: number;
  expires: number;
};

export type TSecurityQuestionTemplate = {
  id: string;
  prompt: string;
};

export type TNewSecurityQuestionDataSubmission = {
  [keyof in "q0" | "q1" | "q2"]: {
    selectedQuestionId: string;
    selectedQuestionPrompt: string;
    response: string;
  };
};

export type TSecurityQuestionSecureDisplay = {
  [keyof in "q0" | "q1" | "q2"]: {
    selectedQuestionId: string;
    selectedQuestionPrompt: string;
  };
};

export type TGetTwoFactorEnabledResponse = {
  twoFactorAuthentication: {
    enabled: boolean;
  };
};

export type TTFAValidationResponse = {
  status: "error" | "ok" | string;
  isEnrollment: boolean;
  statusMessage: string;
  redirectPath?: string;
};
