import React from "react";
import { Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if user is authenticated

  return (
    <Route
      render={() => {
        return isAuthenticated ? children : <Navigate to="/login" />;
      }}
    />
  );
};

// PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
