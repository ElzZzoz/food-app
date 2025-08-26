import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/auth-logo.png";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Spinner from "../../../Shared/components/Spinner/Spinner";
import { emailValidation } from "../../../Shared/components/utils/formValidations";
import { useAuth } from "../../../../context/useAuth";

function Login() {
  const { login, loginSuccess } = useAuth(); // ✅ use login not onLoginSubmit
  const [showPassword, setShowPassword] = useState(false); // ✅ local state
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitForm = async (data) => {
    await login(data); // send full form data to parent
  };

  useEffect(() => {
    if (loginSuccess) {
      navigate("/dashboard");
    }
  }, [loginSuccess, navigate]);

  return (
    <div className="auth-container">
      <div className="container-fluid bg-overlay">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="col-md-5 rounded-3 bg-white px-5 py-5">
            <div className="logo-container text-center mb-3">
              <img className="w-50" src={logo} alt="logo" />
            </div>
            <div className="title mb-4">
              <h4>Login</h4>
              <p className="text-muted">
                Welcome Back! Please enter your details
              </p>
            </div>

            <form onSubmit={handleSubmit(submitForm)}>
              {/* Email */}
              <div className="input-group mb-3">
                <span className="input-group-text" aria-label="Email icon">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your E-mail"
                  {...register("email", emailValidation)}
                />
              </div>
              {errors.email && (
                <p style={{ color: "red" }}>{errors.email.message}</p>
              )}

              {/* Password */}
              <div className="input-group mb-3">
                <span className="input-group-text" aria-label="Password icon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  />
                </span>
              </div>
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password.message}</p>
              )}

              {/* Links */}
              <div className="links d-flex justify-content-between mb-3">
                <Link
                  to="/forget-password"
                  className="text-muted text-black text-decoration-none"
                >
                  Forgot Password?
                </Link>
                <Link
                  to="/register"
                  className="text-success text-decoration-none"
                >
                  Create an Account
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary bg-success w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner size="sm" color="light" /> : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
