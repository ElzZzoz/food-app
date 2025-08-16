// src/utils/formValidations.js
export const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email address",
  },
};

export const passwordValidation = {
  required: "Password is required",
  minLength: { value: 6, message: "Must be at least 6 characters" },
};

export const confirmPasswordValidation = (getPassword) => ({
  required: "Please confirm your password",
  validate: (value) => value === getPassword() || "Passwords do not match",
});

export const otpValidation = {
  required: "OTP is required",
  minLength: { value: 4, message: "Enter at least 4 digits" },
};
