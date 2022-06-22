import { Switch } from "@mui/material";
import { useState } from "react";

function ControlledSwitch(): JSX.Element {
  const [checked, setChecked] = useState<boolean>(false);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  return (
    <Switch
      checked={checked}
      inputProps={{ "aria-label": "controlled" }}
      onChange={handleSwitchChange}
    />
  );
}

export default ControlledSwitch;
