import { connectDB } from "./config/db";
import { env } from "./config/env";
import { Project } from "./models/project.model";
import { Task } from "./models/task.model";
import { User } from "./models/user.model";

async function seedDatabase(): Promise<void> {
    await connectDB();

    await Promise.all([
        User.deleteMany({}),
        Project.deleteMany({}),
        Task.deleteMany({}),
    ]);

    const admin = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "Password123!",
        role: "admin",
    });

    const member = await User.create({
        name: "Member User",
        email: "member@example.com",
        password: "Password123!",
        role: "member",
    });

    const project = await Project.create({
        title: "Demo Project",
        description: "Seeded project for testing the API",
        status: "active",
        owner: member._id,
    });

    await Task.create({
        title: "Demo Task",
        description: "Seeded task under the demo project",
        status: "pending",
        priority: "high",
        dueDate: new Date("2026-06-30"),
        project: project._id,
        owner: member._id,
    });

    console.log("Database seeded successfully");
    console.log("Admin login: admin@example.com / Password123!");
    console.log("Member login: member@example.com / Password123!");
    console.log(`Environment: ${env.nodeEnv}`);

    process.exit(0);
}

seedDatabase().catch((error) => {
    console.error("Database seeding failed", error);
    process.exit(1);
});
