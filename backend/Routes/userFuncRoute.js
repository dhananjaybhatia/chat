import express from "express";
import { isLoggedIn } from "../Middleware/userMiddleware.js";
import { getUserBySearch, getCurrentUser } from "../Controllers/userChatController.js";

const router = express.Router();

router.get("/search", isLoggedIn, getUserBySearch);

router.get("/currentChatter", isLoggedIn, getCurrentUser);

export default router;
