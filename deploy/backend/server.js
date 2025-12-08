const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");

app.use(cors());
app.use(express.json());

app.get("/products", (req, res) => {
  const data = fs.readFileSync("products.json");
  const products = JSON.parse(data);
  res.json(products);
});

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
