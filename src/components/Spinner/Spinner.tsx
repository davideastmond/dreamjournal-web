import CircularProgress from "@mui/material/CircularProgress";
import "./style.css";

function Spinner() {
  return (
    <div className="Spinner__main flex centered-spinner-position">
      <CircularProgress />
    </div>
  );
}
export default Spinner;
