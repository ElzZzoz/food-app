/**
 * UsersList.jsx
 * -----------------
 * Component to manage users: view, update, and delete.
 * - Fetches users from API and displays them in a table.
 * - Provides modals for update and delete actions.
 * - Integrates with react-hook-form for handling updates.
 * - Uses axios for API communication.
 */

import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { usersApi, api } from "../../../../services/urls/urls";

// UI Libraries
import Header from "../../../Shared/components/Header/Header";
import boyPhoto from "../../../../assets/images/BoyPhoto.png";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Modal, Spinner, Badge, Pagination } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons"; // pick any "no photo" icon
import { Dropdown } from "react-bootstrap";
import { faEllipsisV, faEye } from "@fortawesome/free-solid-svg-icons";

// Custom Components
import DeleteConfirmation from "../../../Shared/components/DeleteConfirmation/DeleteConfirmation";
import NoData from "../../../Shared/components/NoData/NoData";
// import { useAuth } from "../../../../context/useAuth";

function UsersList() {
  // const { userData } = useAuth();
  // ============================
  // State Management
  // ============================
  const [users, setUsers] = useState([]); // list of users
  const [loading, setLoading] = useState(false); // loading spinner
  const [showDeleteModal, setShowDeleteModal] = useState(false); // delete modal
  const [showUpdateModal, setShowUpdateModal] = useState(false); // update modal
  const [selectedUserId, setSelectedUserId] = useState(null); // currently selected user id
  const [selectedUser, setSelectedUser] = useState(null); // currently selected user data
  const [groupsList, setGroupsList] = useState([]); // groups/roles dropdown list
  const [countriesList, setCountriesList] = useState([]); // countries dropdown list
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0); // from API response
  const [pageGroup, setPageGroup] = useState(0); // 0 = first 4 pages, 1 = next 4, etc.
  const [searchUserName, setSearchUserName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [groupId, setGroupId] = useState("");
  // extra state to hold "applied filters"
  const [appliedFilters, setAppliedFilters] = useState({});

  // Debounced values
  const debouncedUserName = useDebounce(searchUserName);
  const debouncedEmail = useDebounce(searchEmail);
  const debouncedCountry = useDebounce(searchCountry);
  const debouncedGroupId = useDebounce(groupId);

  const navigate = useNavigate();

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    // setValue,
  } = useForm();

  // ============================
  // Handlers - Modals
  // ============================
  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedUserId(null);
  };

  const handleShowDelete = (id) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
  };

  const handleCloseUpdate = () => {
    setShowUpdateModal(false);
    setSelectedUser(null);
    reset();
  };

  // const handleShowUpdate = (user) => {
  //   setSelectedUser(user);
  //   setSelectedUserId(user.id);

  //   // Pre-populate form with current user data
  //   setValue("userName", user.userName);
  //   setValue("email", user.email);
  //   setValue("phoneNumber", user.phoneNumber);
  //   setValue("country", user.country);
  //   setValue("group", user.group?.id || "");

  //   setShowUpdateModal(true);
  // };
  //------------------------------------------
  //pagination logic
  //------------------------------------------
  const pagesPerGroup = 4;
  const startPage = pageGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // ============================
  // API Calls
  // ============================

  /**
   * Fetch all users (with pagination by default: page 1, size 10).
   */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        pageSize,
        pageNumber,
        ...appliedFilters,
      };
      console.log("Fetching with params:", params); // 👀 check what’s being sent

      const res = await usersApi.getAll(params);

      setUsers(res.data.data || []);
      setTotalPages(res.data.totalNumberOfPages || 0);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a user by ID.
   */
  const handleDelete = async () => {
    try {
      await usersApi.delete(selectedUserId);
      fetchUsers();
      handleCloseDelete();
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response?.data || error.message
      );
      toast.error("Error deleting user");
    }
  };

  /**
   * Update user details using PUT request.
   */
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("No token found in localStorage");

      // prepare user data
      const userData = {
        userName: data.userName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        country: data.country,
        group: data.group,
      };

      const res = await axios.put(
        `https://upskilling-egypt.com:3006/api/v1/Users/${selectedUserId}`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers(); // refresh after update
      toast.success(res.data.message || "User updated successfully!");
      reset();
      handleCloseUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating user");
      console.error("Error updating user:", err.response?.data || err.message);
    }
  };

  function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  }

  /**
   * Get all groups/roles (used in update form dropdown).
   */
  const getAllGroups = async () => {
    try {
      const res = await usersApi.getGroups();
      setGroupsList(res.data || []);
    } catch (err) {
      console.error(
        "Error fetching groups:",
        err.response?.data || err.message
      );
    }
  };

  const CustomToggle = forwardRef(({ onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ cursor: "pointer" }}
    >
      <FontAwesomeIcon icon={faEllipsisV} />
    </span>
  ));

  /**
   * Get all countries (mock data - replace with actual API if available).
   */
  const getAllCountries = () => {
    // Mock countries data - replace with actual API call if available
    const countries = [
      "Egypt",
      "Saudi Arabia",
      "UAE",
      "Jordan",
      "Lebanon",
      "Syria",
      "Iraq",
      "Morocco",
      "Tunisia",
      "Algeria",
      "Libya",
      "Sudan",
      "United States",
      "United Kingdom",
      "Germany",
      "France",
      "Other",
    ];
    setCountriesList(countries);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  /**
   * Get status badge variant based on user status
   */
  const getStatusVariant = (isVerified) => {
    return isVerified ? "success" : "warning";
  };

  // ============================
  // Lifecycle
  // ============================

  useEffect(() => {
    setAppliedFilters({
      userName: debouncedUserName || undefined,
      email: debouncedEmail || undefined,
      country: debouncedCountry || undefined,
      groups: debouncedGroupId || undefined,
    });
    setPageNumber(1); // reset to first page when filters change
  }, [debouncedUserName, debouncedEmail, debouncedCountry, debouncedGroupId]);

  useEffect(() => {
    fetchUsers();
  }, [pageNumber, appliedFilters]);

  useEffect(() => {
    getAllGroups();
    getAllCountries();
  }, []);

  // Adjust group when pageNumber changes manually
  useEffect(() => {
    setPageGroup(Math.floor((pageNumber - 1) / pagesPerGroup));
  }, [pageNumber]);

  console.log("users", users);

  if (users[3]) {
    console.log(`https://upskilling-egypt.com:3006${users[3].imagePath}`);
  }

  // ============================
  // Render
  // ============================
  return (
    <div className="vh-100">
      {/* Page Header */}
      <Header
        imgPath={boyPhoto}
        title="Users List"
        desc="Manage system users, view their details, and perform administrative actions."
      />

      {/* Section Title + Add Button */}
      <div className="container-fluid mb-4">
        <div className="add-button-container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h2 className="mb-1 fw-bold">Users Table Details</h2>
            <p className="mb-0 text-muted">
              Manage your users — view, update, or delete user accounts as
              needed.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="row my-3">
          {/* Username filter */}
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by username..."
              value={searchUserName}
              onChange={(e) => setSearchUserName(e.target.value)}
            />
          </div>

          {/* Email filter */}

          {/* Country filter */}
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by country..."
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
            />
          </div>

          {/* Groups filter */}
          <div className="col-md-3">
            <select
              className="form-control"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              <option value="">-- Filter by Group --</option>
              <option value="1">Admin</option>
              <option value="2">System User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="custom-table text-center">
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : users.length === 0 ? (
          <NoData message="No users found" />
        ) : (
          <div
            className="table-responsive"
            style={{ width: "100%", overflowX: "auto" }}
          >
            <Table striped bordered hover responsive>
              <thead className="no-border">
                <tr>
                  <th>Username</th>
                  <th>Image</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    {/* 👇 Image Column */}
                    <td>
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#0d6efd",
                          textDecoration: "underline",
                        }}
                        onClick={() => navigate(`/dashboard/users/${user.id}`)}
                      >
                        {user.userName || "N/A"}
                      </span>
                    </td>

                    <td>
                      {user.imagePath ? (
                        <img
                          src={`https://upskilling-egypt.com:3006/${user.imagePath.replace(
                            /^\/?/,
                            ""
                          )}`}
                          alt={user.userName}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          size="2x"
                          style={{ color: "#ccc" }}
                          title="No photo"
                        />
                      )}
                    </td>

                    <td
                      style={{
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user.email}
                    </td>
                    <td>{user.phoneNumber || "N/A"}</td>
                    <td
                      style={{
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user.country || "N/A"}
                    </td>
                    <td>
                      <Badge
                        bg={
                          user.group?.name === "SuperAdmin"
                            ? "danger"
                            : "primary"
                        }
                        className="px-2 py-1"
                      >
                        {user.group?.name || "User"}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        bg={getStatusVariant(user.isVerified)}
                        className="px-2 py-1"
                      >
                        {user.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </td>
                    <td>{formatDate(user.creationDate)}</td>
                    <td>
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          as={CustomToggle}
                          id={`dropdown-${user.id}`}
                        />

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() =>
                              navigate(`/dashboard/users/${user.id}`)
                            }
                          >
                            <FontAwesomeIcon icon={faEye} className="me-2" />
                            View
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleShowDelete(user.id)}
                            className="text-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <DeleteConfirmation deleteItem="user" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Update User Modal */}
        <Modal
          show={showUpdateModal}
          onHide={handleCloseUpdate}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                {/* Username */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Username</label>
                  <input
                    {...register("userName", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                    type="text"
                    className="form-control"
                    placeholder="Enter username"
                  />
                  {errors.userName && (
                    <span className="text-danger">
                      {errors.userName.message}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <span className="text-danger">{errors.email.message}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    {...register("phoneNumber")}
                    type="tel"
                    className="form-control"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Country */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Country</label>
                  <select className="form-control" {...register("country")}>
                    <option value="">-- Select Country --</option>
                    {countriesList.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role/Group */}
                <div className="col-12 mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-control" {...register("group")}>
                    <option value="">-- Select Role --</option>
                    {groupsList.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseUpdate}>
                  Cancel
                </Button>
                <Button type="submit" variant="success">
                  Save Changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
        <Pagination className="justify-content-center flex-wrap mt-3">
          {/* First / Prev Group */}
          <Pagination.First
            onClick={() => {
              setPageNumber(1);
              setPageGroup(0);
            }}
            disabled={pageNumber === 1}
          />
          <Pagination.Prev
            onClick={() => {
              if (pageGroup > 0) setPageGroup(pageGroup - 1);
            }}
            disabled={pageGroup === 0}
          />

          {/* Page Numbers */}
          {pageNumbers.map((page) => (
            <Pagination.Item
              key={page}
              active={page === pageNumber}
              onClick={() => setPageNumber(page)}
            >
              {page}
            </Pagination.Item>
          ))}

          {/* Next Group / Last */}
          <Pagination.Next
            onClick={() => {
              if (endPage < totalPages) setPageGroup(pageGroup + 1);
            }}
            disabled={endPage >= totalPages}
          />
          <Pagination.Last
            onClick={() => {
              setPageNumber(totalPages);
              setPageGroup(Math.floor((totalPages - 1) / pagesPerGroup));
            }}
            disabled={pageNumber === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
}

export default UsersList;
