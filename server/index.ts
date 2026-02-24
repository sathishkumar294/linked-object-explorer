import express from "express";
import cors from "cors";
import { requirementsRouter } from "./routes/requirements.js";

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/requirements", requirementsRouter);

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`[API] Server running on http://localhost:${PORT}`);
});
