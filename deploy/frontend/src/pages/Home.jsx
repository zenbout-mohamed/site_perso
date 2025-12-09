import { useEffect, useState } from "react";

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("➡️ Appel API lancé...");

    fetch("http://localhost:3001/products")
      .then(res => {
        console.log("➡️ Réponse brute :", res);
        return res.json();
      })
      .then(data => {
        console.log("➡️ Données reçues :", data);
        setProducts(data);
      })
      .catch(err => {
        console.error("❌ Erreur API :", err);
        setError(err.toString());
      });
  }, []);

  return (
    <div>
      <h1>Produits</h1>

      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
      {products.length === 0 && !error && <p>Chargement...</p>}

      {products.map(p => (
        <a
          key={p.id}
          href={`/product/${p.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              margin: "10px",
              borderRadius: "8px",
              display: "block"
            }}
          >
            <h3>{p.name}</h3>
            <strong>{p.price} €</strong>
          </div>
        </a>
      ))}
    </div>
  );
}

export default Home;
