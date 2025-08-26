import "./App.css";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
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
import UsersData from "./modules/Users/components/Users-Data";
import { useAuth } from "./context/useAuth";

function App() {
  const { token } = useAuth(); // ✅ safe now (because App is wrapped in AuthProvider in main.jsx)

  const routes = createBrowserRouter([
    {
      path: "",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          ),
        },
        { path: "login", element: <Login /> },
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
          element: <MasterLayout />,
          children: [
            { index: true, element: <Dashboard /> },
            {
              path: "categories",
              element: <ProtectedRoute allowedGroups={["SuperAdmin"]} />,
              children: [
                { index: true, element: <CategoriesList /> },
                { path: "category-data", element: <CategoryData /> },
              ],
            },

            { path: "recipes", element: <RecipesList /> },
            { path: "recipes-data", element: <RecipesData /> },
            {
              path: "recipes-data/:id",
              element: <RecipesData mode="update" />,
            },
            {
              path: "recipes-view/:id",
              element: <RecipesData mode="view" />,
            },

            {
              path: "favourites",
              element: <ProtectedRoute allowedGroups={["SystemUser"]} />,
              children: [{ index: true, element: <FavList /> }],
            },
            {
              path: "users",
              element: <ProtectedRoute allowedGroups={["SuperAdmin"]} />,
              children: [
                { index: true, element: <UsersList /> },
                { path: ":id", element: <UsersData /> },
              ],
            },
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
