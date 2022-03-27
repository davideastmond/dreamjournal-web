import dayjs from "dayjs";
export const isEmailValid = ({ email }: { email: string }): boolean => {
  const regEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(email);
};

export const getFormattedDate = ({
  dateString,
}: {
  dateString: string;
}): string => {
  return dayjs(dateString).format("HH:mm ddd MMM D, YYYY");
};
