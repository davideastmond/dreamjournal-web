import { Grid } from "@mui/material";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { JournalList } from "../../components/JournalList";
import { selectSessionUser } from "../../reducers/app-slice";
import {
  getAllJournalsForUserAsync,
  selectJournals,
} from "../../reducers/journal-slice";

function HomePage() {
  const journals = useSelector(selectJournals, shallowEqual);
  const sessionUser = useSelector(selectSessionUser, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionUser) {
      dispatch(getAllJournalsForUserAsync({ userId: sessionUser._id }));
    }
  }, [sessionUser]);
  return (
    <div className="HomePage__main">
      <JournalList journals={journals} />
    </div>
  );
}

export default HomePage;
