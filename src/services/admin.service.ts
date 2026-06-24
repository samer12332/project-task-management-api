import { Types } from "mongoose";
import { Project, IProject } from "../models/project.model";
import { Task, ITask } from "../models/task.model";
import { IUser, User } from "../models/user.model";
import { getPaginationOptions } from "../utils/pagination";

interface AdminListQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

function getDocumentId(document: { _id: unknown }): string {
    return (document._id as Types.ObjectId).toString();
}

function sanitizeUser(user: IUser) {
    return {
        id: getDocumentId(user),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

function sanitizeProject(project: IProject) {
    return {
        id: getDocumentId(project),
        title: project.title,
        description: project.description,
        status: project.status,
        owner: project.owner,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };
}

function sanitizeTask(task: ITask) {
    return {
        id: getDocumentId(task),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        project: task.project,
        owner: task.owner,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    };
}

export async function getAllUsers(query: AdminListQuery) {
    const { page, limit, skip, sortBy, sortOrder } =
        getPaginationOptions(query);

    const [users, total] = await Promise.all([
        User.find()
            .sort([[sortBy, sortOrder]])
            .skip(skip)
            .limit(limit),
        User.countDocuments(),
    ]);

    return {
        users: users.map(sanitizeUser),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getAllProjects(query: AdminListQuery) {
    const { page, limit, skip, sortBy, sortOrder } =
        getPaginationOptions(query);

    const [projects, total] = await Promise.all([
        Project.find()
            .sort([[sortBy, sortOrder]])
            .skip(skip)
            .limit(limit),
        Project.countDocuments(),
    ]);

    return {
        projects: projects.map(sanitizeProject),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getAllTasks(query: AdminListQuery) {
    const { page, limit, skip, sortBy, sortOrder } =
        getPaginationOptions(query);

    const [tasks, total] = await Promise.all([
        Task.find()
            .sort([[sortBy, sortOrder]])
            .skip(skip)
            .limit(limit),
        Task.countDocuments(),
    ]);

    return {
        tasks: tasks.map(sanitizeTask),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
