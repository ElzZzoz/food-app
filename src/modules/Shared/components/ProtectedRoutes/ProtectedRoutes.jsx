import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedGroups }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      // ✅ Role check
      if (allowedGroups && !allowedGroups.includes(decoded.userGroup)) {
        navigate("/dashboard", { replace: true }); // redirect to safe page
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate, allowedGroups]);

  // Only render children if authorized
  return isAuthorized ? <Outlet /> : null;
};

export default ProtectedRoute;
