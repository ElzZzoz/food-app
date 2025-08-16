import React from "react";

function Spinner({ size = "sm", color = "light" }) {
  // size: 'sm' or 'lg' (Bootstrap sizes)
  // color: any Bootstrap text color class like 'light', 'dark', 'primary'
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className={`spinner-border spinner-border-${size} text-${color}`}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
