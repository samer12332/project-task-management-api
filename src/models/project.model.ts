import { Document, model, Schema, Types } from "mongoose";

export type ProjectStatus = "planning" | "active" | "completed" | "archived";

export interface IProject extends Document {
    title: string;
    description?: string;
    status: ProjectStatus;
    owner: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true,
            minlength: [2, "Project title must be at least 2 characters"],
            maxlength: [100, "Project title must not exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [
                1000,
                "Project description must not exceed 1000 characters",
            ],
        },
        status: {
            type: String,
            enum: ["planning", "active", "completed", "archived"],
            default: "planning",
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

export const Project = model<IProject>("Project", projectSchema);
