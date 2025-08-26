import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import logo from "../../../../assets/images/sidebarIcon.png";
import { useState } from "react";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"; // ✅ logout icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../../../context/useAuth";
import ChangePasswordModal from "../../../Authentecation/components/ChangePass/ChangePass";

function SideBar() {
  const { logout, userData } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
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

          {userData?.userGroup === "SuperAdmin" && (
            <MenuItem component={<Link to="users" />}>
              <i className="fa fa-users me-2" /> Users
            </MenuItem>
          )}

          <MenuItem component={<Link to="recipes" />}>
            <i className="fa fa-utensils me-2" /> Recipes
          </MenuItem>

          {/* ⭐ New Favorites item */}
          {userData?.userGroup != "SuperAdmin" && (
            <MenuItem component={<Link to="favourites" />}>
              <i className="fa fa-star me-2" /> Favorites
            </MenuItem>
          )}

          {userData?.userGroup === "SuperAdmin" && (
            <MenuItem component={<Link to="categories" />}>
              <i className="fa fa-list-alt me-2" /> Categories
            </MenuItem>
          )}

          <MenuItem onClick={() => setShowChangePassword(true)}>
            <i className="fa fa-key me-2" /> Change Password
          </MenuItem>

          <ChangePasswordModal
            show={showChangePassword}
            onHide={() => setShowChangePassword(false)}
          />

          <MenuItem
            icon={<FontAwesomeIcon icon={faRightFromBracket} />}
            onClick={logout}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}

export default SideBar;
