import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Product.css";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Produit introuvable");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.toString()));
  }, [id]);

  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
  if (!product) return <p>Chargement...</p>;

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetch(`http://localhost:3001/cart/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
    }

    alert("Produit ajouté !");
  }

  return (
    <div className="product-container">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price} €</p>

      <button onClick={addToCart}>
        Ajouter au panier
      </button>
    </div>
  );
}

export default Product;
