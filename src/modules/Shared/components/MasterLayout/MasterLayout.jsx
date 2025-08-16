import SideBar from "../SideBar/SideBar";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

function MasterLayout({ userData }) {
  return (
    <>
      <div className="d-flex vh-100">
        <div className="bg-light ">
          <SideBar userData={userData} />
        </div>
        <div className="w-100  text-white">
          <Navbar userData={userData} />
          {/* <Header /> */}
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MasterLayout;
