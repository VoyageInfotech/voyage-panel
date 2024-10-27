import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "./routes";
import { useMaterialUIController } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import PropTypes from "prop-types"; // Fixed import

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function App() {
  const [controller] = useMaterialUIController();
  const { direction, layout, sidenavColor, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  const publicRoutes = routes.filter((route) => route.isPublic);
  const privateRoutes = routes.filter((route) => !route.isPublic);

  const isAuthenticated = !!localStorage.getItem("token");

  const renderLayout = (isRtl, themeVariant) => (
    <ThemeProvider theme={themeVariant}>
      <CssBaseline />
      {layout === "dashboard" &&
        isAuthenticated && ( // Render Sidenav only if authenticated
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Material Dashboard 2"
              routes={privateRoutes}
            />
            <Configurator />
          </>
        )}
      <Routes>
        {getRoutes(publicRoutes)}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Routes>{getRoutes(privateRoutes)}</Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      {renderLayout(true, darkMode ? themeDarkRTL : themeRTL)}
    </CacheProvider>
  ) : (
    renderLayout(false, darkMode ? themeDark : theme)
  );
}
