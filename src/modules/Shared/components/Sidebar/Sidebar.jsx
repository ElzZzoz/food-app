import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/sidebarIcon.png";
import { useState } from "react";

function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage or cookies
    localStorage.removeItem("token");

    // Optionally clear any app state
    // e.g. dispatch({ type: "LOGOUT" });

    // Redirect to login page
    navigate("/login");
  };
  return (
    <div className="sidebar-container ">
      <Sidebar collapsed={isCollapsed}>
        <Menu>
          <MenuItem
            onClick={toggleSidebar}
            className="my-4 d-flex align-items-center justify-content-center"
          >
            <img src={logo} alt="Logo" />
          </MenuItem>

          <MenuItem component={<Link to="/dashboard" />}>
            <i className="fa fa-home me-2" /> Home
          </MenuItem>

          {/* <MenuItem component={<Link to="users" />}>
            <i className="fa fa-users me-2" /> Users
          </MenuItem> */}

          <MenuItem component={<Link to="recipes" />}>
            <i className="fa fa-utensils me-2" /> Recipes
          </MenuItem>

          <MenuItem component={<Link to="categories" />}>
            <i className="fa fa-list-alt me-2" /> Categories
          </MenuItem>

          {/* <MenuItem>
            <i className="fa fa-key me-2" /> Change Password
          </MenuItem> */}

          <MenuItem onClick={handleLogout}>
            <i className="fa fa-sign-out-alt me-2" /> Log Out
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}

export default SideBar;
