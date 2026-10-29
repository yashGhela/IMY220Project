import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "./cookies";

// change these to match your routes
const SPLASH = "/";
const AUTH = "/auth";
const HOME = "/home";
const RANDOM = '/*'

// the only pages a logged-out visitor can see
const PUBLIC_PATHS = [SPLASH, AUTH, RANDOM];

// Call this once, inside the router. It re-checks the userId cookie on every
// page change, and returns whether the current page may be shown.
export function useAuthGuard() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const loggedIn = Boolean(getCookie("userId"));

  // "/auth/" and "/auth" count as the same page
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const isPublic = PUBLIC_PATHS.includes(path);

  // logged in: everything except splash/auth. logged out: only splash/auth
  const allowed = loggedIn ? !isPublic : isPublic;

  useEffect(() => {
    if (!allowed) {
      navigate(loggedIn ? HOME : AUTH, { replace: true });
    }
  }, [allowed, loggedIn, navigate]);

  return allowed;
}