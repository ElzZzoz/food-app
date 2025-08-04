import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // If you store user info

    // Optionally: clear Redux or context if used
    // dispatch(logoutUser());

    // Show success toast
    toast.success("👋 Logged out successfully");

    // Navigate to login
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary px-4 py-2 shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          YourApp
        </a>

        {/* Logout button */}
        <button
          className="btn btn-outline-danger ms-auto"
          onClick={handleLogout}
        >
          <i className="fa fa-sign-out-alt me-1"></i>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
