import { Router } from "express";
import invitationRoutes from "./invitation.route";

const router = Router();

// Mount invitation routes
router.use("/invitations", invitationRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).send({
    message: "API is running successfully",
    timestamp: new Date().toISOString()
  });
});

export default router;