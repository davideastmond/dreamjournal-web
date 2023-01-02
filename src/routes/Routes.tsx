import { AppNavBar } from "../components/AppNavBar";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { HomePage } from "../scenes/HomePage";
import { JournalEntryListScene } from "../scenes/JournalEntryListScene";
import { JournalEntryScene } from "../scenes/JournalEntryScene";
import { JournalScene } from "../scenes/JournalScene";
import { NewJournal } from "../scenes/NewJournal";
import { NewJournalEntryScene } from "../scenes/NewJournalEntryScene";
import { NotFound404 } from "../scenes/NotFound404";
import { ProfileSettings } from "../scenes/ProfileSettings";
import { PasswordResetScene } from "../scenes/ResetPasswordScene";
import Splash from "../scenes/Splash";
import { pallet } from "../styling/pallets";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { selectHasActiveSession } from "../reducers/app-slice";

export const AppRoutes = () => {
  const hasSession = useSelector(selectHasActiveSession, shallowEqual);
  return (
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
          path="/journals/:journalId/entries"
          element={
            <ProtectedRoute redirectPath="/">
              <JournalEntryListScene />
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
        <Route
          path="/settings"
          element={
            <ProtectedRoute redirectPath="/">
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route path="/recover" element={<PasswordResetScene />} />
        <Route
          path="/error"
          element={
            <div>
              <h3 style={{ color: pallet.redText }}>Error</h3>
              <p>Expired or invalid</p>
            </div>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Router>
  );
};
