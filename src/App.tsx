import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import "./App.css";
import {
  getHasActiveSessionAsync,
  selectHasActiveSession,
  getSessionUserAsync,
} from "./reducers/app-slice";
import Splash from "./scenes/Splash";

import { Stage } from "./Stage";
function App() {
  const hasSession = useSelector(selectHasActiveSession, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHasActiveSessionAsync());
    dispatch(getSessionUserAsync());
  }, []);
  return <div className="App">{hasSession ? <Stage /> : <Splash />}</div>;
}

export default App;
