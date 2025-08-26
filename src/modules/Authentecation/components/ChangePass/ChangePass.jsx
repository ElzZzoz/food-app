import { Modal, Button, Spinner, Image } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useState } from "react";
import logo from "../../../../assets/images/change-logo.png";

function ChangePasswordModal({ show, onHide }) {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false); // toggle state

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPasswords((prev) => !prev);
  };

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return toast.error("No token found in localStorage");

    setLoading(true);
    try {
      await axios.put(
        "https://upskilling-egypt.com:3006/api/v1/Users/ChangePassword",
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Password changed successfully!");
      reset();
      onHide();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error changing password");
      console.error("Error changing password:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        className="border-0 d-flex flex-column align-items-center"
      >
        <Image
          src={logo} // replace with your logo path
          alt="App Logo"
          style={{ width: "150px", marginBottom: "10px", height: "80px" }}
        />
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Old Password */}
          <div className="mb-3 position-relative">
            <label className="form-label">Old Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              className="form-control"
              placeholder="Enter old password"
              {...register("oldPassword", {
                required: "Old password is required",
              })}
            />
            {errors.oldPassword && (
              <small className="text-danger">
                {errors.oldPassword.message}
              </small>
            )}
          </div>

          {/* New Password */}
          <div className="mb-3 position-relative">
            <label className="form-label">New Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              className="form-control"
              placeholder="Enter new password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.newPassword && (
              <small className="text-danger">
                {errors.newPassword.message}
              </small>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="mb-3 position-relative">
            <label className="form-label">Confirm New Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              className="form-control"
              placeholder="Confirm new password"
              {...register("confirmNewPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
            />
            {errors.confirmNewPassword && (
              <small className="text-danger">
                {errors.confirmNewPassword.message}
              </small>
            )}
          </div>

          {/* Show/Hide Password Toggle */}
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPasswords"
              checked={showPasswords}
              onChange={togglePasswordVisibility}
            />
            <label htmlFor="showPasswords" className="form-check-label">
              Show Passwords
            </label>
          </div>

          {/* Only One Submit Button */}

          <div className="text-center">
            <Button
              type="submit"
              variant="success"
              disabled={loading}
              className="px-4"
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default ChangePasswordModal;
