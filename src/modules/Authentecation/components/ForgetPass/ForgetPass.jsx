import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../../../assets/images/auth-logo.png";
import { useNavigate } from "react-router-dom";

function ForgetPass() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Users/Reset/Request",
        data
      );
      console.log("Reset link sent:", response.data);
      toast.success("📬 Reset link sent to your email.");
      reset();
      navigate("/reset-password"); // Redirect to reset password page
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Something went wrong. Try again.";
      toast.error(`❌ ${errorMsg}`);
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
            <div className="title text-center">
              <h4>Forgot Password</h4>
              <p className="text-muted">
                Enter your email and we’ll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group mb-3">
                <span className="input-group-text" id="email-addon">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your E-mail"
                  aria-label="Email"
                  aria-describedby="email-addon"
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
                <p className="text-danger small">{errors.email.message}</p>
              )}

              <button
                type="submit"
                className="btn btn-primary bg-success w-100"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPass;
