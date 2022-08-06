import { useState } from "react";
import { TextFieldProps, TextField, styled } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface IDatePickerProps {
  onDateChange?: (value: any) => void;
  label: string;
  disableHighlightToday?: boolean;
  openTo?: "month" | "day" | "year";
  isError?: boolean;
  errorText?: string;
  disableFuture?: boolean;
  classes?: any;
  slim?: boolean;
  inputProps?: any;
}

type TCalendarStyledTextInputProps = {
  slim: boolean;
} & TextFieldProps;

const CalendarStyledTextInput = styled(
  TextField
)<TCalendarStyledTextInputProps>(({ ...props }) => ({
  "&&& input": {
    height: `${props.slim ? "0" : "unset"}`,
    width: "100%",
  },
  "&.MuiTextField-root": {
    width: `${props.slim ? "100%" : "unset"}`,
    padding: "2px",
  },
  "& .MuiFormLabel-root": {
    top: `${props.slim ? "-7px" : "unset"}`,
  },
}));

function CustomDatePicker(props: IDatePickerProps) {
  const [dateOfBirthValue, setDateOfBirthValue] = useState<any>(null);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={props.label}
        disableFuture={props.disableFuture}
        disableHighlightToday={props.disableHighlightToday}
        autoFocus
        openTo={props.openTo || "month"}
        value={dateOfBirthValue}
        onChange={(newValue: any) => {
          props.onDateChange && props.onDateChange(newValue);
          setDateOfBirthValue(newValue);
        }}
        renderInput={(textFieldProps: any) => (
          <CalendarStyledTextInput
            {...textFieldProps}
            slim={props.slim}
            error={props.isError}
            helperText={props.errorText}
            required
          />
        )}
        InputProps={props.inputProps}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
