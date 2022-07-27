import { Grid, Button } from "@mui/material";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { patchUserBasicProfileDataAsync } from "../../reducers/app-slice";
import { GridRow } from "./GridRow";

export function PersonalPanel({
  email,
  firstName,
  lastName,
  sessionUserId,
}: {
  email: string;
  firstName: string;
  lastName: string;
  sessionUserId: string | undefined;
}) {
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [firstNameTextData, setFirstNameTextData] = useState<string>(firstName);
  const [lastNameTextData, setLastNameTextData] = useState<string>(lastName);
  const dispatch = useDispatch();

  const handleSubmitPersonalData = () => {
    if (sessionUserId) {
      dispatch(
        patchUserBasicProfileDataAsync({
          firstName: firstNameTextData,
          lastName: lastNameTextData,
          userId: sessionUserId,
        })
      );
      setCanEdit(false);
    }
  };

  const originalFirstNameDataRef = useRef(firstName);
  const originalLastNameDataRef = useRef(lastName);
  const handleCancelEdit = () => {
    setCanEdit(!canEdit);
    setFirstNameTextData(originalFirstNameDataRef.current);
    setLastNameTextData(originalLastNameDataRef.current);

    const firstNameTextBox = document.getElementById(
      "firstname"
    ) as HTMLInputElement;
    const lastNameTextBox = document.getElementById(
      "lastname"
    ) as HTMLInputElement;
    firstNameTextBox.value = originalFirstNameDataRef.current;
    lastNameTextBox.value = originalLastNameDataRef.current;
  };
  return (
    <div>
      <header>
        <h3 className="black-text">Basic personal info</h3>
      </header>
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
      </Grid>
      <footer className="top-margin-buffer">
        {canEdit ? (
          <Button variant="outlined" color="error" onClick={handleCancelEdit}>
            Cancel edit
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="success"
            onClick={() => setCanEdit(!canEdit)}
          >
            Edit
          </Button>
        )}
        {canEdit && (
          <Button variant="outlined" onClick={handleSubmitPersonalData}>
            Save
          </Button>
        )}
      </footer>
    </div>
  );
}
