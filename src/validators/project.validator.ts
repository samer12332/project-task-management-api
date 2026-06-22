import { body, param, query } from "express-validator";

const allowedProjectStatuses = ["planning", "active", "completed", "archived"];
const allowedSortFields = ["createdAt", "updatedAt", "title", "status"];

export const createProjectValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Project title must be between 2 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Project description must not exceed 1000 characters"),

    body("status")
        .optional()
        .isIn(allowedProjectStatuses)
        .withMessage(
            "Project status must be one of: planning, active, completed, archived",
        ),
];

export const updateProjectValidator = [
    param("projectId").isMongoId().withMessage("Invalid project ID"),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Project title must be between 2 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Project description must not exceed 1000 characters"),

    body("status")
        .optional()
        .isIn(allowedProjectStatuses)
        .withMessage(
            "Project status must be one of: planning, active, completed, archived",
        ),
];

export const projectIdValidator = [
    param("projectId").isMongoId().withMessage("Invalid project ID"),
];

export const listProjectsValidator = [
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

    query("status")
        .optional()
        .isIn(allowedProjectStatuses)
        .withMessage(
            "Project status must be one of: planning, active, completed, archived",
        ),
];
