import { styled, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { pallet } from "../../styling/pallets";

interface IControlledSwitchProps {
  onStateChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  defaultDisabled?: boolean;
  customStyles?: any;
  trackColor?: string;
}

const StyledControlledSwitch = styled(Switch)<IControlledSwitchProps>(
  ({ theme, ...props }) => ({
    "& .MuiSwitch-track": {
      backgroundColor: `${props.trackColor ? props.trackColor : "unset"}`,
    },
  })
);

function ControlledSwitch(props: IControlledSwitchProps) {
  const [switchChecked, setSwitchChecked] = useState<boolean>(
    !!props.defaultChecked
  );
  const [switchDisabled, setSwitchDisabled] = useState<boolean>(false);

  useEffect(() => {
    props.defaultChecked && setSwitchChecked(props.defaultChecked);
  }, [props.defaultChecked]);

  useEffect(() => {
    props.defaultDisabled && setSwitchDisabled(props.defaultDisabled);
  }, [props.defaultDisabled]);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setSwitchChecked(checked);
    props.onStateChange && props.onStateChange(checked);
  };
  return (
    <StyledControlledSwitch
      checked={switchChecked}
      disabled={switchDisabled}
      inputProps={{ "aria-label": "controlled" }}
      onChange={handleSwitchChange}
      trackColor={pallet.lightSalmon}
    />
  );
}

export default ControlledSwitch;
