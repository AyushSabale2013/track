import express from "express";
import { registerUser, login , logout , getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "Protected route",
        user: req.user
    });
});

router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;