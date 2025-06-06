import express from "express";
import rateLimiter from "../middleware/rateLimit.js";
import { addVaultItem, getUserVaultItems, updateUserVaultItem } from "../controllers/vaultController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateVaultItem, validateVaultItemId } from "../validators/vaultValidator.js";
import { deleteVaultItemById } from "../models/VaultItem.js";



const router = express.Router();

// router to handle vault item routes

router.post("/items", authenticateToken, validateVaultItem, addVaultItem);

router.get("/items", authenticateToken, getUserVaultItems);

router.get("/items/:id",authenticateToken, validateVaultItemId, getUserVaultItems);

router.put("/items/:id", authenticateToken, validateVaultItemId, validateVaultItem, updateUserVaultItem);

router.delete("/items/:id", authenticateToken, validateVaultItemId, deleteVaultItemById);

router.post("/test", rateLimiter, (req, res) => {
  res.send("Test route");
});

router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


export default router;