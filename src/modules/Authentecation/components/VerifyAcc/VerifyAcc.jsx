/**
 * VerifyAcc Component
 * -------------------
 * Handles user account verification by submitting the email and verification code.
 * - Uses react-hook-form for form validation & handling
 * - Auto-fills the email if passed from previous step (via `useLocation`)
 * - Automatically focuses the verification code input on load
 * - Submits data to the backend API with axios
 * - Provides success/error feedback using react-toastify
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../../../../assets/images/auth-logo.png"; // Adjust path if needed

function VerifyAcc() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const defaultEmail = state?.email || "";

  const [loading, setLoading] = useState(false);

  /**
   * React Hook Form setup
   * - `defaultValues`: pre-fill email if passed from register step
   * - `setFocus`: used to auto-focus on the "code" input field
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setFocus,
  } = useForm({
    defaultValues: {
      email: defaultEmail,
      code: "",
    },
  });

  /**
   * If an email is passed from the previous step,
   * set it in the form and focus the verification code input
   */
  useEffect(() => {
    if (defaultEmail) {
      setValue("email", defaultEmail);
      setFocus("code"); // ✅ Auto-focus code input
    }
  }, [defaultEmail, setValue, setFocus]);

  /**
   * Submit handler
   * - Sends verification request to API
   * - On success: notify user & redirect to login
   * - On failure: show error message
   */
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put(
        "https://upskilling-egypt.com:3006/api/v1/Users/verify",
        {
          email: data.email,
          code: data.code,
        }
      );

      console.log("Account verified:", response.data);
      toast.success("✅ Account verified successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Verification error:", err.response?.data || err);
      const errorMsg =
        err.response?.data?.message || "Something went wrong. Try again.";
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
            {/* Logo */}
            <div className="logo-container text-center">
              <img className="w-50" src={logo} alt="logo" />
            </div>

            {/* Title */}
            <div className="title mb-4">
              <h4>Verify Account</h4>
              <p className="text-muted">
                Enter your email and verification code
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Input */}
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
                />
              </div>
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}

              {/* Verification Code Input */}
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-shield" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the verification code"
                  {...register("code", {
                    required: "Verification code is required",
                    maxLength: {
                      value: 4,
                      message: "Code must be 4 digits",
                    },
                  })}
                />
              </div>
              {errors.code && (
                <p className="text-danger">{errors.code.message}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Account"}
              </button>

              {/* Back to Login Link */}
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

export default VerifyAcc;
