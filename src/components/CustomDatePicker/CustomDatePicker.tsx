import { useState } from "react";
import { TextFieldProps, TextField, styled } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { pallet } from "../../styling/pallets";

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
  calendarIconColor?: string;
  lightText?: boolean;
  maxDate?: Date;
}

type TCalendarStyledTextInputProps = {
  slim: boolean;
  lightText?: boolean;
  calendarIconColor?: string;
} & TextFieldProps;

const CalendarStyledTextInput = styled(
  TextField
)<TCalendarStyledTextInputProps>(({ ...props }) => ({
  "&&& input": {
    height: `${props.slim ? "0" : "unset"}`,
    width: "100%",
    color: `${props.lightText ? pallet.skyBlue : pallet.greyDark2}`,
    fontWeight: "300",
  },
  "&.MuiTextField-root": {
    width: `${props.slim ? "100%" : "unset"}`,
    padding: "2px",
  },
  "&&& .MuiFormLabel-root": {
    top: `${props.slim ? "-7px" : "unset"}`,
    color: `${props.lightText ? pallet.eggShellWhite : pallet.greyDark2}`,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: `${props.lightText ? pallet.eggShellWhite : pallet.greyDark2}`,
  },
  "& .MuiSvgIcon-root": {
    color: `${props.calendarIconColor || pallet.greyDark1}`,
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
        maxDate={props.maxDate}
        autoFocus
        openTo={props.openTo || "month"}
        value={dateOfBirthValue}
        onChange={(newValue: any) => {
          console.debug("calendar change new value", newValue);
          props.onDateChange && props.onDateChange(newValue);
          setDateOfBirthValue(newValue);
        }}
        renderInput={(textFieldProps: any) => (
          <CalendarStyledTextInput
            {...textFieldProps}
            slim={props.slim}
            error={props.isError}
            helperText={props.errorText}
            calendarIconColor={props.calendarIconColor}
            lightText={props.lightText}
            required
          />
        )}
        InputProps={props.inputProps}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
