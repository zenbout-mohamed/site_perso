import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/">Boutique</Link>
      <Link to="/cart">Panier</Link>

      <div className="navbar-right">
        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>
              Bonjour, {user.name}
            </span>
            <button onClick={handleLogout}>Se déconnecter</button>
          </>
        ) : (
          <Link to="/login">Se connecter</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
