import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/" style={{ marginRight: "20px" }}>Accueil</Link>
      <Link to="/cart">Panier</Link>
    </nav>
  );
}

export default NavBar;