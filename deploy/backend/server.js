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

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.error("Erreur écriture users.json :", err);
  }
}

// Routes Produits
app.get("/products", (req, res) => {
  res.set("Cache-Control", "no-store");
  const products = readProducts();
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  res.set("Cache-Control", "no-store");
  const products = readProducts();
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "Produit non trouvé" });
  res.json(product);
});

// Route Login avec bcrypt
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "email et password sont obligatoires",
    });
  }

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ ok: false, message: "Email ou mot de passe invalide" });
  }

  return res.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

// Récupérer le panier
app.get("/cart/:userId", (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === Number(req.params.userId));

  if (!user) {
    return res.status(404).json({
      ok: false,
      message: "Utilisateur non trouvé"
    });
  }

  res.json({ ok: true, cart: user.cart || [] });
});

//  Enregistrer le panier
app.post("/cart/:userId", (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === Number(req.params.userId));

  if (!user) {
    return res.status(404).json({
      ok: false,
      message: "Utilisateur non trouvé"
    });
  }

  user.cart = req.body.cart || [];
  writeUsers(users);

  res.json({ ok: true, cart: user.cart });
});

// Récupérer le panier d'un utilisateur
app.get("/cart/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const users = readUsers();

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ ok: false, message: "Utilisateur introuvable" });
  }

  res.json({ ok: true, cart: user.cart || [] });
});

// Sauvegarder le panier d'un utilisateur
app.post("/cart/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const { cart } = req.body;

  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ ok: false, message: "Utilisateur introuvable" });
  }

  users[userIndex].cart = cart;
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ ok: true, cart });
});

// Lancement serveur
app.listen(port, () => {
  console.log(`API lancée sur http://localhost:${port}`);
});
