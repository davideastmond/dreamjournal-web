import { Grid, Box, styled } from "@mui/material";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { CustomDatePicker } from "../../components/CustomDatePicker";
import { patchUserBasicProfileDataAsync } from "../../reducers/app-slice";

import dayjs from "dayjs";
import { StyledHeaderComponent } from "../../components/StyledHeader";
import { StyledButtonComponent } from "../../components/StyledButton";
import { pallet } from "../../styling/pallets";
import { GridRow } from "./components/grid-row";

const StyledBox = styled(Box)((props) => ({
  [props.theme.breakpoints.up("md")]: {
    "&.MuiBox-root": {
      marginLeft: "10%",
      marginRight: "10%",
    },
  },
}));
export function PersonalPanel({
  email,
  firstName,
  lastName,
  dateOfBirth,
  sessionUserId,
}: {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null | undefined;
  sessionUserId: string | undefined;
}) {
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [firstNameTextData, setFirstNameTextData] = useState<string>(firstName);
  const [lastNameTextData, setLastNameTextData] = useState<string>(lastName);
  const [dobTextData, setDobTextData] = useState<string | null | undefined>(
    dateOfBirth ? dateOfBirth : null
  );
  const [hasDobError, setHasDobError] = useState<boolean>(false);
  const [dobErrorText, setDobErrorText] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleSubmitPersonalData = () => {
    if (!isDateValid(dobTextData)) {
      setDobErrorText("Date is not valid");
      setHasDobError(true);
      return;
    }
    if (sessionUserId) {
      clearDobError();
      dispatch(
        patchUserBasicProfileDataAsync({
          firstName: firstNameTextData,
          lastName: lastNameTextData,
          userId: sessionUserId,
          dateOfBirth: (dobTextData! as any).$d,
        })
      );
      setCanEdit(false);
    }
  };

  const handleCalendarDateChange = (value: any) => {
    console.log("some value", value);
    if (isDateValid(value)) setDobTextData(value);
  };

  const isDateValid = (date: any): boolean => {
    const valid = dayjs(date, "MMM-DD-YYYY", true).isValid();
    if (valid) return true;
    const composedDate = dayjs(date);
    return dayjs(composedDate, "MMM-DD-YYYY", true).isValid();
  };

  const clearDobError = () => {
    setHasDobError(false);
    setDobErrorText(null);
  };

  const originalFirstNameDataRef = useRef(firstName);
  const originalLastNameDataRef = useRef(lastName);
  const originalDobRef = useRef(dateOfBirth);

  const handleCancelEdit = () => {
    setCanEdit(!canEdit);
    setFirstNameTextData(originalFirstNameDataRef.current);
    setLastNameTextData(originalLastNameDataRef.current);
    clearDobError();
    const firstNameTextBox = document.getElementById(
      "firstname"
    ) as HTMLInputElement;
    const lastNameTextBox = document.getElementById(
      "lastname"
    ) as HTMLInputElement;
    const dobBox = document.getElementById("dob") as HTMLInputElement;
    firstNameTextBox.value = originalFirstNameDataRef.current;
    lastNameTextBox.value = originalLastNameDataRef.current;
    dobBox.value = originalDobRef.current as string;
  };

  const formatDob = (date: any): string => {
    if (isDateValid(date)) {
      return dayjs(date).format("MMM-DD-YYYY");
    }
    return "Not set";
  };

  const getCustomDatePicker = () => {
    return (
      <CustomDatePicker
        label="Enter date of birth"
        slim={true}
        onDateChange={handleCalendarDateChange}
        isError={hasDobError}
        errorText={dobErrorText || undefined}
        lightText={true}
      />
    );
  };
  return (
    <StyledBox>
      <StyledHeaderComponent text="Basic personal info" sizeVariant="h5" />
      <Grid container spacing={2}>
        <GridRow canEdit={false} label="E-mail" contentData={email} />
        <GridRow
          canEdit={canEdit}
          label="First Name"
          contentData={firstNameTextData}
          onEdit={setFirstNameTextData}
          idTag="firstname"
        />
        <GridRow
          canEdit={canEdit}
          label="Last Name"
          contentData={lastNameTextData}
          onEdit={setLastNameTextData}
          idTag="lastname"
        />
        {!dateOfBirth && (
          <GridRow
            canEdit={canEdit}
            idTag="dob"
            label="Date of birth"
            component={getCustomDatePicker()}
            contentData={
              formatDob((dobTextData as any).$d?.toString()) || "Unspecified"
            }
          />
        )}
        {dateOfBirth && (
          <GridRow
            canEdit={canEdit}
            idTag="dob"
            label="Date of birth"
            component={getCustomDatePicker()}
            contentData={formatDob(dobTextData)}
          />
        )}
      </Grid>
      <footer className="top-margin-buffer">
        {canEdit ? (
          <StyledButtonComponent
            textLabel="Cancel edit"
            fillColor={pallet.redText}
            onClick={handleCancelEdit}
          />
        ) : (
          <StyledButtonComponent
            textLabel="Edit"
            fillColor={pallet.aquaBlueGreen}
            onClick={() => setCanEdit(!canEdit)}
          />
        )}
        {canEdit && (
          <StyledButtonComponent
            textLabel="Save"
            fillColor={pallet.aquaBlueGreen}
            onClick={handleSubmitPersonalData}
            customStyles={{ marginLeft: "10px" }}
          />
        )}
      </footer>
    </StyledBox>
  );
}
