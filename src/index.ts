import { appInfo } from "@/common/utils";
import { app, logger } from "@/server";
import { env } from "./config/envConfig";

const { NODE_ENV, HOST, PORT } = env;

const server = app.listen(PORT, () => {
  logger.info(`Server (${NODE_ENV}) running on http://${HOST}:${PORT}`);
  console.log(`
    🎉  Welcome to Our Application!
    ================================
    
    Version: ${appInfo.version}
    Application Name: ${appInfo.name}
    Environment: ${NODE_ENV}
    Host: ${HOST}
    Listening on Port: ${PORT}

    ✔︎ All services are enabled and running smoothly. 
    Thank you for using our application! 

    ================================
    🚀 Let's get started! 🚀
    `);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down server`);
  server.close(() => {
    logger.info("Server closed");
    process.exit();
  });

  // Force shutdown after 10 seconds if graceful shutdown doesn't complete
  setTimeout(() => process.exit(1), 10000).unref();
};

["SIGINT", "SIGTERM"].forEach((signal) =>
  process.on(signal, () => gracefulShutdown(signal))
);
