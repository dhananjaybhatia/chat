import express from "express";
import { sendMessage, getMessage } from "../Controllers/messageController.js";
import { isLoggedIn } from "../Middleware/userMiddleware.js";

const router = express.Router();

router.post("/send/:id", isLoggedIn, sendMessage);

router.get("/:id", isLoggedIn, getMessage);

export default router;
