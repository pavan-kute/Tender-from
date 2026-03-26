import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link className="site-brand" to="/">
          <span className="site-brand__title">Tender Form</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "Close Menu" : "Open Menu"}
        </button>
      </div>

      <div className={`site-header__panel ${menuOpen ? "is-open" : ""}`}>
        <nav className="site-nav" aria-label="Primary">
          <NavLink className={({ isActive }) => `site-nav__link${isActive ? " active" : ""}`} to="/login">
            Login
          </NavLink>
          <NavLink className={({ isActive }) => `site-nav__link${isActive ? " active" : ""}`} to="/register">
            Register
          </NavLink>
          <NavLink className={({ isActive }) => `site-nav__link${isActive ? " active" : ""}`} to="/tender">
            Tender Form
          </NavLink>
          <NavLink className={({ isActive }) => `site-nav__link${isActive ? " active" : ""}`} to="/report">
            Report
          </NavLink>
        </nav>

        <div className="site-user">
          {user && user.fullName ? (
            <>
              <div className="site-user__card">
                <span className="site-user__label">Signed in</span>
                <span className="site-user__name">{user.fullName}</span>
              </div>
              <button className="app-btn app-btn--soft" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <p className="site-user__muted">Not logged in</p>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
