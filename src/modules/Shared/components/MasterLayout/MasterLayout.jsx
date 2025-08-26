import SideBar from "../SideBar/SideBar";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/useAuth";

function MasterLayout() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
  };
  return (
    <>
      <div className="d-flex vh-100 overflow-hidden">
        <div className="bg-light">
          <SideBar userData={userData} onLogout={handleLogout} />
        </div>
        <div className="w-100 text-white d-flex flex-column">
          <Navbar userData={userData} />
          <div className="flex-grow-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default MasterLayout;
