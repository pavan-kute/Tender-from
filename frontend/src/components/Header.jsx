import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/"><b>Tender Form </b></Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tender">Tender</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/report">Report</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {user && user.fullName ? (
              <>
                <span className="me-3">Hello, {user.fullName}</span>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <span className="text-muted">Not logged in</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
