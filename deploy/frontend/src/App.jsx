import { useEffect, useState } from "react";

function Home() { const [products, setProducts] = useState([]);

useEffect(() => {
  fetch("http://localhost:3001/products")
  .then(res => res.json())
  .then(data => setProducts(data))
  .catch(err => console.error("Erreur API :", err)); 
}, []);
return( 
  Produits{products.length === 0 && <p>Chargement...</p>}
    {products.map(p => (
    <div key={p.id} style={{
      border:"1px solid #ddd",
      padding:"10px",
      margin:"10px",
      borderRadius:"8px"
    }}>
      <h3>{p.name}</h3>
      <p>{p.description}</p>
      <strong>{p.price} €</strong>
    </div>
  ))}
</div>

); }

export default Home;
