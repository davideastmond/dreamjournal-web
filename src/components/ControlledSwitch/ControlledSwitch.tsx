import { Switch } from "@mui/material";
import { useEffect, useState } from "react";

interface IControlledSwitchProps {
  onStateChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  defaultDisabled?: boolean;
}

function ControlledSwitch(props: IControlledSwitchProps) {
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);
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
    <Switch
      checked={switchChecked}
      disabled={switchDisabled}
      inputProps={{ "aria-label": "controlled" }}
      onChange={handleSwitchChange}
    />
  );
}

export default ControlledSwitch;
