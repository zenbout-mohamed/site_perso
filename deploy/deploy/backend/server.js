const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Paths
const PRODUCTS_FILE = path.join(__dirname, "products.json");
const USERS_FILE = path.join(__dirname, "users.json");

// ------ UTILITIES ------
function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function readProducts() {
  try {
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));
  } catch {
    return [];
  }
}

// ------ API PRODUITS ------
app.get("/products", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(readProducts());
});

app.get("/products/:id", (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Produit non trouvé" });
  res.json(product);
});

// ------ LOGIN ------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });

  res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
});

// ------ PANIER ------
app.get("/cart/:userId", (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === Number(req.params.userId));
  if (!user) return res.status(404).json({ ok: false, message: "Utilisateur non trouvé" });

  res.json({ ok: true, cart: user.cart || [] });
});

app.post("/cart/:userId", (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === Number(req.params.userId));
  if (!user) return res.status(404).json({ ok: false, message: "Utilisateur non trouvé" });

  user.cart = req.body.cart;
  writeUsers(users);
  res.json({ ok: true, cart: user.cart });
});

// ------ SERVIR LE FRONTEND BUILDÉ ------
app.use(express.static(path.join(__dirname, "../frontend")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// ------ START SERVER ------
app.listen(port, () => {
  console.log(`Site déployé sur http://localhost:${port}`);
});
