import { Router } from "express";
import { getMe, login, register } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import {
    loginValidator,
    registerValidator,
} from "../validators/auth.validator";

const router = Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.get("/me", protect, getMe);

export default router;
