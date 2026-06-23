import { body, param, query } from "express-validator";

const allowedTaskStatuses = ["pending", "in_progress", "done"];
const allowedTaskPriorities = ["low", "medium", "high"];
const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "title",
    "status",
    "priority",
    "dueDate",
];

export const createTaskValidator = [
    param("projectId").isMongoId().withMessage("Invalid project ID"),

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Task title must be between 2 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Task description must not exceed 1000 characters"),

    body("status")
        .optional()
        .isIn(allowedTaskStatuses)
        .withMessage("Task status must be one of: pending, in_progress, done"),

    body("priority")
        .optional()
        .isIn(allowedTaskPriorities)
        .withMessage("Task priority must be one of: low, medium, high"),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid ISO 8601 date"),
];

export const updateTaskValidator = [
    param("projectId").isMongoId().withMessage("Invalid project ID"),
    param("taskId").isMongoId().withMessage("Invalid task ID"),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Task title must be between 2 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Task description must not exceed 1000 characters"),

    body("status")
        .optional()
        .isIn(allowedTaskStatuses)
        .withMessage("Task status must be one of: pending, in_progress, done"),

    body("priority")
        .optional()
        .isIn(allowedTaskPriorities)
        .withMessage("Task priority must be one of: low, medium, high"),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid ISO 8601 date"),
];

export const taskIdValidator = [
    param("projectId").isMongoId().withMessage("Invalid project ID"),
    param("taskId").isMongoId().withMessage("Invalid task ID"),
];

export const listTasksValidator = [
    param("projectId").isMongoId().withMessage("Invalid project ID"),

    query("status")
        .optional()
        .isIn(allowedTaskStatuses)
        .withMessage("Task status must be one of: pending, in_progress, done"),

    query("priority")
        .optional()
        .isIn(allowedTaskPriorities)
        .withMessage("Task priority must be one of: low, medium, high"),

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive number"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),

    query("sortBy")
        .optional()
        .isIn(allowedSortFields)
        .withMessage("Invalid sort field"),

    query("sortOrder")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Sort order must be asc or desc"),
];
