import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Fonction pour recharger le panier
    const updateCart = () => {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(stored);
    };

    // Charger au démarrage
    updateCart();

    // Mettre à jour si localStorage change ailleurs
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-container">
      <h1>Mon Panier</h1>

      {cart.length === 0 && <p>Votre panier est vide.</p>}

      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <h3>{item.name}</h3>
          <p>{item.price} €</p>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h2>Total : {total.toFixed(2)} €</h2>

          <button
            className="clear-btn"
            onClick={() => {
              localStorage.removeItem("cart");
              setCart([]);
            }}
          >
            Vider le panier
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
