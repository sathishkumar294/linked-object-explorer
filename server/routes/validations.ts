import { Router, Request, Response } from "express";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.resolve(__dirname, "../data/meansOfValidation.json");

export const validationRouter = Router();

/**
 * GET /api/validations
 * Returns all means of validation from the JSON data file.
 */
validationRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const raw = await readFile(DATA_PATH, "utf-8");
        const data = JSON.parse(raw);
        res.json(data);
    } catch (err) {
        console.error("[API] Failed to read validations data:", err);
        res.status(500).json({ error: "Failed to load validations data" });
    }
});
