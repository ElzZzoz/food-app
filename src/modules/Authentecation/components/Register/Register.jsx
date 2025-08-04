import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import logo from "../../../../assets/images/auth-logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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

      const response = await axios.post(
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
      console.log("Response:", response.data);
      navigate("/verify-account");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(`❌ ${errorMsg}`);
      console.error("Error:", error);
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

            <div className="title">
              <h4>Register</h4>
              <p className="text-muted">
                Welcome Back! Please enter your details
              </p>
            </div>

            <form onSubmit={handleSubmit(handleRegister)}>
              <div className="row">
                {/* Row 1: Username + Email */}
                <div className="col-md-6 mb-3">
                  <label>User Name</label>
                  <div className="input-group custom-input">
                    <span className="input-group-text">
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
                  {errors.username && (
                    <p className="text-danger small">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <div className="input-group custom-input">
                    <span className="input-group-text">
                      <i className="fa fa-envelope" />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email format",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-danger small">{errors.email.message}</p>
                  )}
                </div>

                {/* Row 2: Country + Phone */}
                <div className="col-md-6 mb-3">
                  <label>Country</label>
                  <div className="input-group custom-input">
                    <span className="input-group-text">
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
                    <p className="text-danger small">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Phone Number</label>
                  <div className="input-group custom-input">
                    <span className="input-group-text">
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
                  {errors.phone && (
                    <p className="text-danger small">{errors.phone.message}</p>
                  )}
                </div>

                {/* Row 3: Password + Confirm Password */}
                <div className="col-md-6 mb-3">
                  <label>Password</label>
                  <div className="input-group custom-input">
                    <span className="input-group-text">
                      <i className="fa fa-lock" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="form-control"
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
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`fa ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-danger small">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Confirm Password</label>
                  <div className="input-group custom-input">
                    <span className="input-group-text">
                      <i className="fa fa-lock" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Confirm Password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`fa ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
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
              </div>
              <div className="mb-3 text-end">
                <Link to="/login" className="text-success text-decoration-none">
                  login now?
                </Link>
              </div>

              <button type="submit" className="btn btn-success w-100 mt-3">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
