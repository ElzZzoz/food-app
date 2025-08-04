import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

function MasterLayout() {
  return (
    <>
      <div className="d-flex">
        <div className="w-25 bg-light vh-100">
          <Sidebar />
        </div>
        <div className="w-75 bg-dark text-white">
          <Navbar />
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MasterLayout;
