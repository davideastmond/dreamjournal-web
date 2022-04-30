import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { AppNavBar } from "./components/AppNavBar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import {
  getHasActiveSessionAsync,
  getSessionUserAsync,
  selectHasActiveSession,
  selectSessionUser,
} from "./reducers/app-slice";
import { getAllJournalsForUserAsync } from "./reducers/journal-slice";
import { HomePage } from "./scenes/HomePage";
import { JournalEntryScene } from "./scenes/JournalEntryScene";
import { JournalScene } from "./scenes/JournalScene";
import { NewJournal } from "./scenes/NewJournal";
import { NewJournalEntryScene } from "./scenes/NewJournalEntryScene";
import { NotFound404 } from "./scenes/NotFound404";
import Splash from "./scenes/Splash";

function App() {
  const hasSession = useSelector(selectHasActiveSession, shallowEqual);
  const sessionUser = useSelector(selectSessionUser, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHasActiveSessionAsync());
    dispatch(getSessionUserAsync());
    sessionUser &&
      dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
  }, []);

  useEffect(() => {
    window.addEventListener("focus", handleOnFocus);

    return () => {
      window.removeEventListener("focus", handleOnFocus);
    };
  }, []);

  const handleOnFocus = () => {
    console.log("Focus");
    dispatch(getHasActiveSessionAsync());
  };
  return (
    <div className="App">
      <Router>
        <AppNavBar hasSession={hasSession} />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute redirectPath="/">
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new_journal"
            element={
              <ProtectedRoute redirectPath="/">
                <NewJournal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journals/:journalId"
            element={
              <ProtectedRoute redirectPath="/">
                <JournalScene />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journals/:journalId/new"
            element={
              <ProtectedRoute redirectPath="/">
                <NewJournalEntryScene />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data"
            element={
              <ProtectedRoute redirectPath="/">
                <JournalEntryScene />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
