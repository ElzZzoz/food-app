// NoData.jsx
import noDataPhoto from "../../../../assets/images/DeleteGirl.svg";

export default function NoData({ message = "No data available" }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
      <img
        src={noDataPhoto}
        alt="No data"
        style={{ maxWidth: "150px", marginBottom: "1rem" }}
      />
      <h5>{message}</h5>
    </div>
  );
}
