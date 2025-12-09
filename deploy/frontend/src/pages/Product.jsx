import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Product.css";

function Product() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then(res => res.json())
      .then(data => {
        const p = data.find(item => item.id == id);
        setProduct(p);
      })
      .catch(err => console.error("Erreur API :", err));
  }, [id]);

  if (!product) {
    return <p>Chargement...</p>;
  }

  return (
    <div style={{ maxWidth: "400px", margin: "30px" }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p><strong>{product.price} €</strong></p>

      <button
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#4F8",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Ajouter au panier
      </button>
    </div>
  );
}

export default Product;
