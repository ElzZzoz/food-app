import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./modules/Authentecation/components/Login/Login";
import ChangePass from "./modules/Authentecation/components/ChangePass/ChangePass";
import ForgetPass from "./modules/Authentecation/components/ForgetPass/ForgetPass";
import Register from "./modules/Authentecation/components/Register/Register";
import ResetPass from "./modules/Authentecation/components/ResetPass/ResetPass";
import VerifyAcc from "./modules/Authentecation/components/VerifyAcc/VerifyAcc";
import Dashboard from "./modules/Dashboard/components/Dashboard/Dashboard";
import CategoriesList from "./modules/Categories/components/CategoriesList/CategoriesList";
import RecipesList from "./modules/Recipes/components/RecipesList/RecipesList";
import RecipesData from "./modules/Recipes/components/RecipesData/RecipesData";
import FavList from "./modules/Favourites/components/FavList/FavList";
import UsersList from "./modules/Users/components/UsersList/UsersList";
import NotFound from "./modules/Shared/components/NotFound/NotFound";
import MasterLayout from "./modules/Shared/components/MasterLayout/MasterLayout";
import AuthLayout from "./modules/Shared/components/AuthLayout/AuthLayout";
import CategoryData from "./modules/Categories/components/CategoryData/CategoryData";
import ProtectedRoute from "./modules/Shared/components/ProtectedRoutes/ProtectedRoutes";

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSubmit = async (formData) => {
    try {
      const response = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Users/Login",
        formData
      );

      const { token, expiresIn } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("token_expiry", expiresIn);

      const decoded = jwtDecode(token);
      setUserData(decoded); // full decoded user data
      localStorage.setItem("userData", JSON.stringify(decoded)); // ✅ save in localStorage

      setLoginSuccess(true);
      toast.success("🎉 Logged in successfully");
    } catch (err) {
      toast.error("Login failed: " + (err.response?.data?.message || "Error"));
      setLoginSuccess(false);
    }
  };

  // ✅ Restore user data when app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData(decoded);
        setLoginSuccess(true);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
    }
  }, []);

  const routes = createBrowserRouter([
    {
      path: "",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <Login
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onLoginSubmit={handleLoginSubmit}
              loginSuccess={loginSuccess}
            />
          ),
        },
        {
          path: "login",
          element: (
            <Login
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onLoginSubmit={handleLoginSubmit}
              loginSuccess={loginSuccess}
            />
          ),
        },
        { path: "register", element: <Register /> },
        { path: "forget-password", element: <ForgetPass /> },
        { path: "reset-password", element: <ResetPass /> },
        { path: "verify-account", element: <VerifyAcc /> },
        { path: "change-password", element: <ChangePass /> },
      ],
    },
    {
      path: "dashboard",
      element: <ProtectedRoute />,
      errorElement: <NotFound />,
      children: [
        {
          element: <MasterLayout userData={userData} />,
          children: [
            { index: true, element: <Dashboard userData={userData} /> },
            { path: "categories", element: <CategoriesList /> },
            { path: "category-data", element: <CategoryData /> },
            { path: "recipes", element: <RecipesList /> },
            { path: "recipes-data", element: <RecipesData /> },
            { path: "favourites", element: <FavList /> },
            { path: "users", element: <UsersList userData={userData} /> },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
