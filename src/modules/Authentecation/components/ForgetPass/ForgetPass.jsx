import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/images/auth-logo.png";
import Spinner from "../../../Shared/components/Spinner/Spinner";
import { emailValidation } from "../../../Shared/components/utils/formValidations";

function ForgetPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Users/Reset/Request",
        { email: data.email }
      );
      toast.success("✅ OTP sent! Check your email.");
      navigate("/reset-password", { state: { email: data.email } });
    } catch (err) {
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
            <div className="logo-container text-center mb-4">
              <img className="w-50" src={logo} alt="logo" />
            </div>
            <h4 className="mb-3">Forgot Password</h4>
            <p className="text-muted mb-4">
              Enter your email to receive an OTP
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group mb-3">
                <span className="input-group-text" aria-label="Email icon">
                  <i className="fa fa-envelope" aria-hidden="true" />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your Email"
                  {...register("email", emailValidation)}
                />
              </div>
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner size="sm" color="light" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
