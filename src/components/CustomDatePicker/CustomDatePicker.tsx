import { useState } from "react";
import { TextFieldProps, TextField, styled } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { pallet } from "../../styling/pallets";

interface IDatePickerProps {
  calendarIconColor?: string;
  classes?: any;
  defaultDate?: string;
  disableFuture?: boolean;
  disableHighlightToday?: boolean;
  errorText?: string;
  inputProps?: any;
  isError?: boolean;
  label: string;
  lightText?: boolean;
  maxDate?: Date;
  onBlur?: (e: any) => void;
  onDateChange?: (value: any) => void;
  openTo?: "month" | "day" | "year";
  readOnly?: boolean;
  showEditIcon?: boolean;
  slim?: boolean;
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
  const [dateValue, setDateValue] = useState<any>(props.defaultDate || null);
  const handleKeyboardInput = (e: any) => {
    if (props.readOnly) {
      e.preventDefault();
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={props.label}
        disableFuture={props.disableFuture}
        disableHighlightToday={props.disableHighlightToday}
        maxDate={props.maxDate}
        autoFocus
        openTo={props.openTo || "month"}
        value={dateValue}
        onChange={(newValue: any) => {
          props.onDateChange && props.onDateChange(newValue);
          setDateValue(newValue);
        }}
        renderInput={(textFieldProps: any) => (
          <CalendarStyledTextInput
            {...textFieldProps}
            slim={props.slim}
            error={props.isError}
            helperText={props.errorText}
            calendarIconColor={props.calendarIconColor}
            lightText={props.lightText}
            onKeyDown={handleKeyboardInput}
            required
            onBlur={() => props.onBlur && props.onBlur(dateValue)}
          />
        )}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
