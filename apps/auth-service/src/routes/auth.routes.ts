import { Router } from "express";
import {authenticate} from "../middleware/auth.middleware";
import {login, logout, register} from "../controllers/auth.controller";

const router = Router();
router.get("/", authenticate, (req, res) => {
    res.json({ message: "Authenticated successfully." });
})
router.post("/register", register)
router.post("/login", login);
router.post("/logout", logout);

export default router;