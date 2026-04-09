import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainRoutes from "./routes/MainRoutes";
import { Toaster } from 'react-hot-toast';

const PUBLIC_HEADER_OFFSET = {
  xs: '88px', // Matches mobile header height precisely
  md: '115px', // Matches 2-row desktop header height precisely
};

const App = () => {
  const location = useLocation();

  // Multi-tier session expiration logic
  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem('loginTimestamp');
      if (loginTime) {
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (now - parseInt(loginTime) > TWENTY_FOUR_HOURS) {
          console.warn("Session expired after 24 hours. Logging out...");
          localStorage.clear(); // Wipe all session data
          window.dispatchEvent(new Event("storage"));

          if (location.pathname !== "/login") {
            window.location.href = "/login?session=expired";
          }
        }
      }
    };

    // Check on mount and route change
    checkSession();

    // Periodically check every 5 minutes to catch idle tabs
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAccountRoute = location.pathname.startsWith("/my-account");

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!isAdminRoute && (
        <Box sx={{ displayPrint: 'none' }}>
          <Header />
        </Box>
      )}

      <Box
        sx={{
          pt: !isAdminRoute ? PUBLIC_HEADER_OFFSET : 0,
          '@media print': {
            pt: 0,
          },
        }}
      >
        <MainRoutes />
      </Box>
      {!isAdminRoute && !isAccountRoute && (
        <Box sx={{ displayPrint: 'none' }}>
          <Footer />
        </Box>
      )}
    </>
  );
};

export default App;
