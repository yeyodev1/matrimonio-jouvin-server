import { Router } from "express";
import {
  createInvitation,
  getAllInvitations,
  getInvitationById,
  updateInvitation,
  deleteInvitation
} from "../controllers/invitation.controller";

const router = Router();

// POST /invitations - Create a new invitation
router.post("/", createInvitation);

// GET /invitations - Get all invitations with pagination
router.get("/", getAllInvitations);

// GET /invitations/:id - Get invitation by ID
router.get("/:id", getInvitationById);

// PUT /invitations/:id - Update invitation
router.put("/:id", updateInvitation);

// DELETE /invitations/:id - Delete invitation
router.delete("/:id", deleteInvitation);

export default router;