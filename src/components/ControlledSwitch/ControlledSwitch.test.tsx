import { screen, render, fireEvent } from "../../utils/test-utils/test-utils";
import ControlledSwitch from "./ControlledSwitch";

describe("controlled switch tests", () => {
  test("onChange event gets fired", () => {
    const stateChangeMock = jest.fn();
    render(<ControlledSwitch onStateChange={stateChangeMock} />);
    const controlledSwitch = screen.getByRole("checkbox");
    fireEvent.click(controlledSwitch);
    expect(stateChangeMock).toHaveBeenCalledWith(true);
  });

  test("default disabled", async () => {
    const stateChangeMock = jest.fn();
    render(
      <ControlledSwitch
        onStateChange={stateChangeMock}
        defaultDisabled={true}
      />
    );
    const controlledSwitch = screen.getByRole("checkbox");
    fireEvent.click(controlledSwitch);

    expect(stateChangeMock).not.toHaveBeenCalled();
  });
});
