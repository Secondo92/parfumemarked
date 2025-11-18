import express from "express";
import cors from "cors";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Backend kører"});
});

app.listen(port, () => {
    console.log(`Server lytter på port ${port}`);
});