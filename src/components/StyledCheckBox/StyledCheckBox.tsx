import {
  FormControlLabel,
  Checkbox,
  styled,
  CheckboxProps,
} from "@mui/material";
import React, { useState } from "react";
import { pallet } from "../../styling/pallets";

const StyledCheckBoxComponent = styled(Checkbox)<CheckBoxStyleProps>(
  ({ ...props }) => ({
    "&.MuiCheckbox-root": {
      borderStyle: props.borderStyle || "solid",
      borderColor: props.borderColor || pallet.white,
      borderRadius: props.borderRadius || "0px",
      padding: props.padding || "0px",
      color: props.filledColor || pallet.white,
    },
  })
);

const StyledFormControlLabel = styled(FormControlLabel)<FormControlLabelProps>(
  ({ ...props }) => ({
    "& .MuiFormControlLabel-label": {
      marginLeft: "5px",
    },
  })
);

type FormControlLabelProps = {
  label: string;
  defaultChecked?: boolean;
};

type CheckBoxStyleProps = {
  filledColor?: string;
  borderColor?: string;
  borderThickness?: string;
  borderStyle?: "solid" | "dotted" | "none";
  borderRadius?: string;
  padding?: string;
  onChange?: (checked: boolean) => void;
} & CheckboxProps;

type ComponentProps = FormControlLabelProps & CheckBoxStyleProps;

function StyledCheckBox(props: ComponentProps) {
  const [checked, setChecked] = useState<boolean>(
    props.defaultChecked || false
  );

  const handleOnChange = (event: any) => {
    setChecked(event.target.checked);
    props.onChange && props.onChange(event.target.checked);
  };
  return (
    <StyledFormControlLabel
      control={
        <StyledCheckBoxComponent checked={checked} onChange={handleOnChange} />
      }
      label={props.label}
    />
  );
}

export default StyledCheckBox;
