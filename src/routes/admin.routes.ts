import { Router } from "express";
import {
    getAllProjectsController,
    getAllTasksController,
    getAllUsersController,
} from "../controllers/admin.controller";
import { protect } from "../middlewares/auth.middleware";
import { restrictTo } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { adminListValidator } from "../validators/admin.validator";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router.get(
    "/users",
    adminListValidator,
    validateRequest,
    getAllUsersController,
);
router.get(
    "/projects",
    adminListValidator,
    validateRequest,
    getAllProjectsController,
);
router.get(
    "/tasks",
    adminListValidator,
    validateRequest,
    getAllTasksController,
);

export default router;
