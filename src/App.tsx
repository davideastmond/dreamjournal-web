import { Typography } from "@mui/material";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import "./App.css";
import {
  getHasActiveSessionAsync,
  getSessionUserAsync,
  selectSessionUser,
} from "./reducers/app-slice";
import { getAllJournalsForUserAsync } from "./reducers/journal-slice";
import { AppRoutes } from "./routes/Routes";

function App() {
  const sessionUser = useSelector(selectSessionUser, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHasActiveSessionAsync());
    dispatch(getSessionUserAsync());
    if (sessionUser) {
      dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("focus", handleOnFocus);

    return () => {
      window.removeEventListener("focus", handleOnFocus);
    };
  }, []);

  const handleOnFocus = () => {
    dispatch(getHasActiveSessionAsync());
  };
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
