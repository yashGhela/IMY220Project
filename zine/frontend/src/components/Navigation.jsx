import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCookie, deleteCookie } from "../utils/cookies";
import { useEffect, useState } from "react";

export function Navigation() {
  const [authed, setAuthed] = useState(false);
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthed = () => {
    const userid = getCookie("userId");
    setId(userid);
    setAuthed(!!userid);
  };

  // re-checks the cookie on every page change, so the nav updates after login/logout
  useEffect(() => {
    isAuthed();
  }, [location.pathname]);

  function handleLogout() {
    deleteCookie("userId");
    setAuthed(false);
    setId("");
    navigate("/auth");
  }

  return (
    <nav className="flex mx-5">
      <Link to="/" className="font-black">ZINE</Link>
      <ul>
        {authed ? (
          <div>
            <Link className="mx-10" to="/home">Home</Link>
            <Link className="mx-10" to={`/profile/${id}`}>Profile</Link>
            <Link className="mx-10" to="/createpost">Create Post</Link>
            <Link className="mx-10" to="/createalbum">Create Album</Link>
            <button className="mx-10" onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <div>
            <Link className="mx-10" to="/auth">Join</Link>
            <Link className="mx-10" to="/auth">Login</Link>
          </div>
        )}
      </ul>
    </nav>
  );
}