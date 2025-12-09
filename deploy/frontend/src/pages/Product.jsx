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

  if (!product) return <p>Chargement...</p>;

  return (
    <div className="product-card">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p><strong>{product.price} €</strong></p>

      <button>
        Ajouter au panier
      </button>
    </div>
  );
}

export default Product;
