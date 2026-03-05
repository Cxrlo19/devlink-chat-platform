import { Router } from "express";
import {refreshToken} from "../controllers/refresh.controller";

const router = Router();

router.post("/", refreshToken);

export default router;