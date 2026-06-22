import { Router } from "express";
import {
    createProjectController,
    deleteProjectController,
    getProjectByIdController,
    getProjectsController,
    updateProjectController,
} from "../controllers/project.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import {
    createProjectValidator,
    listProjectsValidator,
    projectIdValidator,
    updateProjectValidator,
} from "../validators/project.validator";

const router = Router();

router.use(protect);

router
    .route("/")
    .post(createProjectValidator, validateRequest, createProjectController)
    .get(listProjectsValidator, validateRequest, getProjectsController);

router
    .route("/:projectId")
    .get(projectIdValidator, validateRequest, getProjectByIdController)
    .patch(updateProjectValidator, validateRequest, updateProjectController)
    .delete(projectIdValidator, validateRequest, deleteProjectController);

export default router;
