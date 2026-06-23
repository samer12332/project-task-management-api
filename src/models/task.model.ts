import { Document, model, Schema, Types } from "mongoose";

export type TaskStatus = "pending" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends Document {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    project: Types.ObjectId;
    owner: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: [2, "Task title must be at least 2 characters"],
            maxlength: [100, "Task title must not exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [
                1000,
                "Task description must not exceed 1000 characters",
            ],
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "done"],
            default: "pending",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        dueDate: {
            type: Date,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    },
);

taskSchema.index({ project: 1, owner: 1 });
taskSchema.index({ status: 1, priority: 1 });

export const Task = model<ITask>("Task", taskSchema);
