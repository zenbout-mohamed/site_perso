import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Product() {
  const { id } = useParams(); // récupère l'id dans l'URL
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

  if (!product)
    return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: "400px", margin: "30px" }}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <strong>{product.price} €</strong>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#4F8",
          cursor: "pointer",
          fontSize: "18px"
        }}
      >
        Ajouter au panier
      </button>
    </div>
  );
}

export default Product;
