import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import logo from "../../../../assets/images/auth-logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../../../Shared/components/Spinner/Spinner";
import { emailValidation } from "../../../Shared/components/utils/formValidations";

function Register() {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleRegister = async (formData) => {
    try {
      const data = new FormData();
      data.append("userName", formData.userName);
      data.append("email", formData.email);
      data.append("country", formData.country);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("password", formData.password);
      data.append("confirmPassword", formData.confirmPassword);

      await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Users/Register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      toast.success("✅ Registered Successfully!");
      navigate("/verify-account");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(`❌ ${errorMsg}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="container-fluid bg-overlay">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="col-md-5 rounded-3 bg-white px-5 py-5">
            <div className="logo-container text-center mb-3">
              <img className="w-50" src={logo} alt="logo" />
            </div>

            <div className="title mb-4">
              <h4>Register</h4>
              <p className="text-muted">Welcome! Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit(handleRegister)}>
              {/* Username */}
              <div className="mb-3">
                <label>User Name</label>
                <div className="input-group">
                  <span className="input-group-text" aria-label="User icon">
                    <i className="fa fa-user" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    {...register("userName", {
                      required: "User name is required",
                    })}
                  />
                </div>
                {errors.userName && (
                  <p className="text-danger small">{errors.userName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label>Email</label>
                <div className="input-group">
                  <span className="input-group-text" aria-label="Email icon">
                    <i className="fa fa-envelope" />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    {...register("email", emailValidation)}
                  />
                </div>
                {errors.email && (
                  <p className="text-danger small">{errors.email.message}</p>
                )}
              </div>

              {/* Country */}
              <div className="mb-3">
                <label>Country</label>
                <div className="input-group">
                  <span className="input-group-text" aria-label="Country icon">
                    <i className="fa fa-globe" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Country"
                    {...register("country", {
                      required: "Country is required",
                    })}
                  />
                </div>
                {errors.country && (
                  <p className="text-danger small">{errors.country.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label>Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text" aria-label="Phone icon">
                    <i className="fa fa-phone" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone"
                    {...register("phoneNumber", {
                      required: "Phone is required",
                      minLength: {
                        value: 10,
                        message: "Phone must be at least 10 digits",
                      },
                    })}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-danger small">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label>Password</label>
                <div className="input-group">
                  <span className="input-group-text" aria-label="Password icon">
                    <i className="fa fa-lock" />
                  </span>
                  <input
                    type={showPassword.password ? "text" : "password"}
                    className="form-control"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        password: !prev.password,
                      }))
                    }
                  >
                    <i
                      className={`fa ${
                        showPassword.password ? "fa-eye-slash" : "fa-eye"
                      }`}
                    />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-danger small">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label>Confirm Password</label>
                <div className="input-group">
                  <span
                    className="input-group-text"
                    aria-label="Confirm password icon"
                  >
                    <i className="fa fa-lock" />
                  </span>
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  >
                    <i
                      className={`fa ${
                        showPassword.confirm ? "fa-eye-slash" : "fa-eye"
                      }`}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-danger small">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="mb-3 text-end">
                <Link to="/login" className="text-success text-decoration-none">
                  login now?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner size="sm" color="light" />
                ) : (
                  "Register"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
