import { Switch } from "@mui/material";
import { useState } from "react";

interface IControlledSwitchProps {
  onStateChange?: (checked: boolean) => void;
}

function ControlledSwitch(props: IControlledSwitchProps) {
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setSwitchChecked(checked);
    props.onStateChange && props.onStateChange(checked);
  };

  return (
    <Switch
      checked={switchChecked}
      inputProps={{ "aria-label": "controlled" }}
      onChange={handleSwitchChange}
    />
  );
}

export default ControlledSwitch;
