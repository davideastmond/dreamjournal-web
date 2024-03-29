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
