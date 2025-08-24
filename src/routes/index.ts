import express, { Application } from "express";
import invitationRoutes from "./invitation.route";

function routerApi(app: Application) {
  const router = express.Router();
  app.use("/api", router);

  // Mount invitation routes
  router.use("/invitations", invitationRoutes);

  // Health check endpoint
  router.get("/health", (req, res) => {
    res.status(200).send({
      message: "API is running successfully",
      timestamp: new Date().toISOString()
    });
  });
}

export default routerApi;