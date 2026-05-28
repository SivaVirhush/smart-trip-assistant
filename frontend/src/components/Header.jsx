import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100 heritage-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand heritage-brand" to="/">
          <span className="brand-mark">IH</span>
          <span className="brand-copy">
            <span className="brand-title">Incredible Heritage</span>
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/features">
                Features
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chat">
                AI Guide
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendar">
                AI Calendar
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cultural-maps">
                Maps
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/live-traffic">
                Traffic
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/current-affairs">
                Current Affairs
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
