import { Router } from "express";
import {
    createTaskController,
    deleteTaskController,
    getTaskByIdController,
    getTasksController,
    updateTaskController,
} from "../controllers/task.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import {
    createTaskValidator,
    listTasksValidator,
    taskIdValidator,
    updateTaskValidator,
} from "../validators/task.validator";

const router = Router();

router.use(protect);

router
    .route("/projects/:projectId/tasks")
    .post(createTaskValidator, validateRequest, createTaskController)
    .get(listTasksValidator, validateRequest, getTasksController);

router
    .route("/projects/:projectId/tasks/:taskId")
    .get(taskIdValidator, validateRequest, getTaskByIdController)
    .patch(updateTaskValidator, validateRequest, updateTaskController)
    .delete(taskIdValidator, validateRequest, deleteTaskController);

export default router;
