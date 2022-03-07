export type TBaseServiceRequest = {
  onSuccess: (data?: any) => void;
  onError: (message?: string) => void;
}

export type TLoginResponseData = {
  token: string,
  issued: number,
  expires: number
}
