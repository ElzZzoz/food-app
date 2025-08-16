import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import logo from "../../../../assets/images/auth-logo.png"; // adjust path
import { useNavigate, useLocation, Link } from "react-router-dom";
import Spinner from "../../../Shared/components/Spinner/Spinner"; // shared spinner

function ResetPass() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // Get email from query params or location state
  useEffect(() => {
    const email =
      location.state?.email ||
      new URLSearchParams(location.search).get("email");
    if (email) setValue("email", email);
  }, [location, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Users/Reset",
        data
      );
      console.log("Password reset successful:", response.data);
      toast.success("✅ Password reset successful!");
      navigate("/login");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Something went wrong. Try again.";
      console.error("Error during password reset:", err.response?.data);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="container-fluid bg-overlay">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="col-md-5 rounded-3 bg-white px-5 py-5">
            <div className="logo-container text-center">
              <img className="w-50" src={logo} alt="logo" />
            </div>
            <div className="title mb-4">
              <h4>Reset Password</h4>
              <p className="text-muted">Please enter your new credentials</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-envelope" />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  disabled
                />
              </div>
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}

              {/* OTP */}
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-lock" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the OTP code"
                  {...register("seed", {
                    required: "OTP is required",
                    minLength: { value: 4, message: "Enter at least 4 digits" },
                  })}
                />
              </div>
              {errors.seed && (
                <p className="text-danger">{errors.seed.message}</p>
              )}

              {/* New Password */}
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-key" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="New Password"
                  {...register("password", {
                    required: "New password is required",
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/, // Example: min 6 chars, letters & numbers
                      message:
                        "Password must be at least 6 characters and include letters and numbers",
                    },
                  })}
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <i
                    className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  />
                </span>
              </div>
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}

              {/* Confirm Password */}
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-key" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  <i
                    className={`fa ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  />
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-danger">{errors.confirmPassword.message}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" color="light" />
                ) : (
                  "Reset Password"
                )}
              </button>

              <div className="text-end mt-3">
                <Link to="/login" className="text-success text-decoration-none">
                  Back to login?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPass;
