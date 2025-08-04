import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../../../assets/images/auth-logo.png"; // adjust if needed
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function VerifyAcc() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
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
      console.error("Verification error:", err.response?.data);
      const errorMsg =
        err.response?.data?.message || "Something went wrong. Try again.";
      toast.error(errorMsg);
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
              <h4>Verify Account</h4>
              <p className="text-muted">
                Enter your email and verification code
              </p>
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
                />
              </div>
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}

              {/* Verification Code (OTP) */}
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-shield-alt" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the verification code"
                  {...register("code", {
                    required: "Verification code is required",
                    minLength: {
                      value: 4,
                      message: "Code must be at least 4 digits",
                    },
                  })}
                />
              </div>
              {errors.code && (
                <p className="text-danger">{errors.code.message}</p>
              )}

              {/* Submit Button */}
              <button type="submit" className="btn btn-success w-100">
                Verify Account
              </button>

              {/* Back to Login */}
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
