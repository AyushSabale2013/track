import express from "express";
import { registerUser, login , logout , getMe } from "../controllers/authController.js";
import { protect , authorize } from "../middleware/authMiddleware.js"

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
router.get(
    "/admin",
    protect,
    authorize("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin"
        });
    }
);

export default router;