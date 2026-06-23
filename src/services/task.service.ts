import { Types } from "mongoose";
import { Project } from "../models/project.model";
import { ITask, Task, TaskPriority, TaskStatus } from "../models/task.model";
import { AppError } from "../utils/AppError";
import { getPaginationOptions } from "../utils/pagination";

interface CreateTaskInput {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
}

interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
}

interface ListTasksQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: TaskStatus;
    priority?: TaskPriority;
}

function getTaskId(task: ITask): string {
    return (task._id as Types.ObjectId).toString();
}

function sanitizeTask(task: ITask) {
    return {
        id: getTaskId(task),
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

async function ensureProjectBelongsToUser(
    userId: string,
    projectId: string,
): Promise<void> {
    const projectExists = await Project.exists({
        _id: new Types.ObjectId(projectId),
        owner: new Types.ObjectId(userId),
    });

    if (!projectExists) {
        throw new AppError("Project not found", 404);
    }
}

export async function createTask(
    userId: string,
    projectId: string,
    input: CreateTaskInput,
) {
    await ensureProjectBelongsToUser(userId, projectId);

    const taskData: {
        title: string;
        project: Types.ObjectId;
        owner: Types.ObjectId;
        description?: string;
        status?: TaskStatus;
        priority?: TaskPriority;
        dueDate?: Date;
    } = {
        title: input.title,
        project: new Types.ObjectId(projectId),
        owner: new Types.ObjectId(userId),
    };

    if (input.description !== undefined) {
        taskData.description = input.description;
    }

    if (input.status !== undefined) {
        taskData.status = input.status;
    }

    if (input.priority !== undefined) {
        taskData.priority = input.priority;
    }

    if (input.dueDate !== undefined) {
        taskData.dueDate = new Date(input.dueDate);
    }

    const task = await Task.create(taskData);

    return sanitizeTask(task);
}

export async function getTasks(
    userId: string,
    projectId: string,
    query: ListTasksQuery,
) {
    await ensureProjectBelongsToUser(userId, projectId);

    const { page, limit, skip, sortBy, sortOrder } =
        getPaginationOptions(query);

    const filter: {
        project: Types.ObjectId;
        owner: Types.ObjectId;
        status?: TaskStatus;
        priority?: TaskPriority;
    } = {
        project: new Types.ObjectId(projectId),
        owner: new Types.ObjectId(userId),
    };

    if (query.status !== undefined) {
        filter.status = query.status;
    }

    if (query.priority !== undefined) {
        filter.priority = query.priority;
    }

    const [tasks, total] = await Promise.all([
        Task.find(filter)
            .sort([[sortBy, sortOrder]])
            .skip(skip)
            .limit(limit),
        Task.countDocuments(filter),
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

export async function getTaskById(
    userId: string,
    projectId: string,
    taskId: string,
) {
    await ensureProjectBelongsToUser(userId, projectId);

    const task = await Task.findOne({
        _id: new Types.ObjectId(taskId),
        project: new Types.ObjectId(projectId),
        owner: new Types.ObjectId(userId),
    });

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    return sanitizeTask(task);
}

export async function updateTask(
    userId: string,
    projectId: string,
    taskId: string,
    input: UpdateTaskInput,
) {
    await ensureProjectBelongsToUser(userId, projectId);

    const updateData: {
        title?: string;
        description?: string;
        status?: TaskStatus;
        priority?: TaskPriority;
        dueDate?: Date;
    } = {};

    if (input.title !== undefined) {
        updateData.title = input.title;
    }

    if (input.description !== undefined) {
        updateData.description = input.description;
    }

    if (input.status !== undefined) {
        updateData.status = input.status;
    }

    if (input.priority !== undefined) {
        updateData.priority = input.priority;
    }

    if (input.dueDate !== undefined) {
        updateData.dueDate = new Date(input.dueDate);
    }

    if (Object.keys(updateData).length === 0) {
        throw new AppError("No fields provided for update", 400);
    }

    const task = await Task.findOneAndUpdate(
        {
            _id: new Types.ObjectId(taskId),
            project: new Types.ObjectId(projectId),
            owner: new Types.ObjectId(userId),
        },
        updateData,
        {
            new: true,
            runValidators: true,
        },
    );

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    return sanitizeTask(task);
}

export async function deleteTask(
    userId: string,
    projectId: string,
    taskId: string,
) {
    await ensureProjectBelongsToUser(userId, projectId);

    const task = await Task.findOneAndDelete({
        _id: new Types.ObjectId(taskId),
        project: new Types.ObjectId(projectId),
        owner: new Types.ObjectId(userId),
    });

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    return sanitizeTask(task);
}
