import { query } from "express-validator";

const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "name",
    "email",
    "title",
    "status",
    "priority",
];

export const adminListValidator = [
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
