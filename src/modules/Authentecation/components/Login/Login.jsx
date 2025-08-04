import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/auth-logo.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify"; // make sure react-toastify is installed and imported
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Users/Login",
        data
      );

      const { token, expiresIn } = response.data;

      // Store token
      localStorage.setItem("token", token);

      // Optional: You can also store expiresIn if you want to use it
      localStorage.setItem("token_expiry", expiresIn);
      console.log("Login successful:", response.data);
      toast.success("🎉 Logged in successfully");
      // Redirect
      navigate("/dashboard"); // Or your home route
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Something went wrong, try again";
      console.error("Error during login:", data, err.response.data);
      console.error("Login failed:", errorMsg);
      alert("Login failed: " + errorMsg);
      toast.error("Login failed: " + errorMsg);
      // Show success toast instead (for testing)
      // toast.success("🎉 Logged in successfully");
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="container-fluid bg-overlay">
          <div className="row vh-100 justify-content-center align-items-center">
            <div className="col-md-5 rounded-3 bg-white px-5 py-5">
              <div className="logo-container text-center">
                <img className="w-50" src={logo} alt="logo" />
              </div>
              <div className="title">
                <h4>Login</h4>
                <p className="text-muted">
                  Welcome Back! Please enter your details
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="fa fa-envelope" aria-hidden="true"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your E-mail"
                    aria-label="Enter your E-mail"
                    aria-describedby="basic-addon1"
                    {...register("email", {
                      required: " Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: " Invalid email address",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p style={{ color: "red" }}>{errors.email.message}</p>
                )}
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="fa fa-key" aria-hidden="true"></i>
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter your Password"
                    aria-label="Enter your Password"
                    aria-describedby="basic-addon1"
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
                  >
                    <i
                      className={`fa ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    />
                  </span>
                </div>

                {errors.password && (
                  <p style={{ color: "red" }}>{errors.password.message}</p>
                )}
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
                <button
                  type="submit"
                  className="btn btn-primary bg-success w-100"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
