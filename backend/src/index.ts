import express from "express";
import cors from "cors";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

interface User {
  name: string;
  email: string;
  password: string;
  sales: number;
  reputation: number;
  createdAt: string;
}

interface Listing {
  id: number;
  title: string;
  description?: string;
  amount: number;
  price: number; // pris i kroner
  type: "fullBottle" | "decant" | "split";
  createdAt: string;
}

// midlertidig hukommelse i stedet for database. FOR NU
let nextId = 1;
const listings: Listing[] = [];
const users: User[] = [];

// status check
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", message: "Backend kører" });
});

// hent alle annoncer
app.get("/api/listings", (req, res) => {
  res.json(listings);
});

// hent en enkelt annonce
app.get("/api/listings/:id", (req, res) => {
  const id = Number(req.params.id);
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return res.status(404).json({ error: "Listing findes ikke" });
  }

  res.json(listing);
});

// Get users
app.get("/api/users", (req, res) => {

});

// get a single user
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return res.status(404).json({ error: "Listing findes ikke" });
  }

  res.json(listing);
});

// create log ind
app.post("/api/createlogin", (req, res) => {
    const { email, name, password } = req.body as Partial<User>;

    if (!email || !name || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const newUser: User = {
        name,
        email,
        password,
        sales: 0,
        reputation: 0,
        createdAt: new Date().toISOString(),
    };

    users.unshift(newUser);

    res.status(201).json(newUser);
});


// opret ny annonce
app.post("/api/listings", (req, res) => {
  const { title, amount, price, type } = req.body as Partial<Listing>;

  if (!title || typeof amount !== "number" || typeof price !== "number" || !type) {
    return res.status(400).json({ error: "Manglende eller ugyldige felter" });
  }

  if (!["fullBottle", "decant", "split"].includes(type)) {
    return res.status(400).json({ error: "Ugyldig type" });
  }

  const newListing: Listing = {
    id: nextId++,
    title,
    amount,
    price,
    type,
    createdAt: new Date().toISOString(),
  };

  listings.unshift(newListing);

  res.status(201).json(newListing);
});

// slet en annonce
app.delete("/api/listings/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = listings.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Listing findes ikke" });
  }

  listings.splice(index, 1);

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server lytter på port ${port}`);
});
