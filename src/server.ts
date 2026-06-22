import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

async function startServer(): Promise<void> {
    await connectDB();

    app.listen(env.port, () => {
        console.log(`Server is running on port ${env.port}`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
});
