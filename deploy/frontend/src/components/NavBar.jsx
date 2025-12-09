import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          🏠 Accueil
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/cart" className="nav-link">
          🛒 Panier
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
