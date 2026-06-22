import { Types } from "mongoose";
import { IProject, Project, ProjectStatus } from "../models/project.model";
import { AppError } from "../utils/AppError";
import { getPaginationOptions } from "../utils/pagination";

interface CreateProjectInput {
    title: string;
    description?: string;
    status?: ProjectStatus;
}

interface UpdateProjectInput {
    title?: string;
    description?: string;
    status?: ProjectStatus;
}

interface ListProjectsQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: ProjectStatus;
}

function getProjectId(project: IProject): string {
    return (project._id as Types.ObjectId).toString();
}

function sanitizeProject(project: IProject) {
    return {
        id: getProjectId(project),
        title: project.title,
        description: project.description,
        status: project.status,
        owner: project.owner,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    };
}

export async function createProject(userId: string, input: CreateProjectInput) {
    const projectData: {
        title: string;
        owner: Types.ObjectId;
        description?: string;
        status?: ProjectStatus;
    } = {
        title: input.title,
        owner: new Types.ObjectId(userId),
    };

    if (input.description !== undefined) {
        projectData.description = input.description;
    }

    if (input.status !== undefined) {
        projectData.status = input.status;
    }

    const project = await Project.create(projectData);

    return sanitizeProject(project);
}

export async function getProjects(userId: string, query: ListProjectsQuery) {
    const { page, limit, skip, sortBy, sortOrder } =
        getPaginationOptions(query);

    const filter: {
        owner: Types.ObjectId;
        status?: ProjectStatus;
    } = {
        owner: new Types.ObjectId(userId),
    };

    if (query.status !== undefined) {
        filter.status = query.status;
    }

    const [projects, total] = await Promise.all([
        Project.find(filter)
            .sort([[sortBy, sortOrder]])
            .skip(skip)
            .limit(limit),
        Project.countDocuments(filter),
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

export async function getProjectById(userId: string, projectId: string) {
    const project = await Project.findOne({
        _id: projectId,
        owner: new Types.ObjectId(userId),
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    return sanitizeProject(project);
}

export async function updateProject(
    userId: string,
    projectId: string,
    input: UpdateProjectInput,
) {
    const updateData: UpdateProjectInput = {};

    if (input.title !== undefined) {
        updateData.title = input.title;
    }

    if (input.description !== undefined) {
        updateData.description = input.description;
    }

    if (input.status !== undefined) {
        updateData.status = input.status;
    }

    if (Object.keys(updateData).length === 0) {
        throw new AppError("No fields provided for update", 400);
    }

    const project = await Project.findOneAndUpdate(
        {
            _id: projectId,
            owner: new Types.ObjectId(userId),
        },
        updateData,
        {
            new: true,
            runValidators: true,
        },
    );

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    return sanitizeProject(project);
}

export async function deleteProject(userId: string, projectId: string) {
    const project = await Project.findOneAndDelete({
        _id: projectId,
        owner: new Types.ObjectId(userId),
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    return sanitizeProject(project);
}
