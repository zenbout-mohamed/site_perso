const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt"); 

// Génération du hash

const hash = bcrypt.hashSync("secret", 10);
console.log("Hash du password :", hash);


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Paths
const PRODUCTS_FILE = path.join(__dirname, "products.json");
const USERS_FILE = path.join(__dirname, "users.json");

// Users
function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erreur lecture users.json :", err);
    return [];
  }
}

// Products
function readProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erreur lecture products.json :", err);
    return [];
  }
}

function writeProducts(products) {
  try {
    fs.writeFileSync(
      PRODUCTS_FILE,
      JSON.stringify(products, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Erreur écriture products.json :", err);
  }
}

// Routes
// Récupérer tous les produits
app.get("/products", (req, res) => {
  res.set("Cache-Control", "no-store");

  const products = readProducts();
  res.json(products);
});

// Récupérer un produit par ID
app.get("/products/:id", (req, res) => {
  res.set("Cache-Control", "no-store");

  const products = readProducts();
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Produit non trouvé" });
  }

  res.json(product);
});

// Ajouter un produit
app.post("/products", (req, res) => {
  const products = readProducts();
  const newProduct = req.body;

  if (!newProduct.name || typeof newProduct.price !== "number") {
    return res.status(400).json({
      error: "name (string) et price (number) sont obligatoires",
    });
  }

  newProduct.id = products.length
    ? Math.max(...products.map((p) => p.id)) + 1
    : 1;

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

// Route Login (ANCIENNE VERSION, tu la remplaceras ensuite)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "email et password sont obligatoires"
    });
  }

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({
      ok: false,
      message: "Email ou mot de passe invalide"
    });
  }

  return res.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

// Lancement serveur
app.listen(port, () => {
  console.log(`API lancée sur http://localhost:${port}`);
});
