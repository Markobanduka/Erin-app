import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import AboutSession from "./components/sessions/AboutSession";
import BioPage from "./pages/profile/BioPage";

const AppRoutes = ({ authUser, bio }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          authUser ? (
            authUser.isAdmin ? (
              <Navigate to="/admin" />
            ) : (
              <HomePage />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/signup"
        element={
          authUser ? (
            authUser.isAdmin ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/" />
            )
          ) : (
            <SignUpPage />
          )
        }
      />
      <Route
        path="/login"
        element={
          !authUser ? (
            <LoginPage />
          ) : authUser.isAdmin ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin"
        element={
          authUser?.isAdmin ? <AdminDashboard /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/profile/:id"
        element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
      />
      <Route path="/session/:id" element={<AboutSession />} />
      <Route path="/bio" element={<BioPage />} bio={bio} />

      <Route
        path="*"
        element={
          authUser ? (
            authUser.isAdmin ? (
              <Navigate to="/admin" />
            ) : (
              <HomePage />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
