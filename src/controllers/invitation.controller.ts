import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import models from "../models";
import { HttpStatusCode } from "axios";

// Create a new invitation
export async function createInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { guestName, numberOfCompanions } = req.body;

    // Validate required fields
    if (!guestName || numberOfCompanions === undefined) {
      res.status(HttpStatusCode.BadRequest).send({
        message: "Guest name and number of companions are required."
      });
      return;
    }

    // Create new invitation
    const invitation = new models.Invitation({
      guestName,
      numberOfCompanions
    });

    const savedInvitation = await invitation.save();

    res.status(HttpStatusCode.Created).send({
      message: "Invitation created successfully.",
      invitation: savedInvitation
    });
    return;
  } catch (error) {
    console.error("Error creating invitation:", error);
    next(error);
  }
}

// Get all invitations with pagination
export async function getAllInvitations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [invitations, totalCount] = await Promise.all([
      models.Invitation.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      models.Invitation.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(HttpStatusCode.Ok).send({
      message: "Invitations retrieved successfully.",
      invitations,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    return;
  } catch (error) {
    console.error("Error getting invitations:", error);
    next(error);
  }
}

// Get invitation by ID
export async function getInvitationById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      res.status(HttpStatusCode.BadRequest).send({
        message: "Invalid invitation ID format."
      });
      return;
    }

    const invitation = await models.Invitation.findById(id).lean();

    if (!invitation) {
      res.status(HttpStatusCode.NotFound).send({
        message: "Invitation not found."
      });
      return;
    }

    res.status(HttpStatusCode.Ok).send({
      message: "Invitation retrieved successfully.",
      invitation
    });
    return;
  } catch (error) {
    console.error("Error getting invitation by ID:", error);
    next(error);
  }
}

// Update invitation
export async function updateInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { guestName, numberOfCompanions } = req.body;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      res.status(HttpStatusCode.BadRequest).send({
        message: "Invalid invitation ID format."
      });
      return;
    }

    // Validate at least one field to update
    if (!guestName && numberOfCompanions === undefined) {
      res.status(HttpStatusCode.BadRequest).send({
        message: "At least one field (guestName or numberOfCompanions) is required for update."
      });
      return;
    }

    // Build update object
    const updateData: any = {};
    if (guestName) updateData.guestName = guestName;
    if (numberOfCompanions !== undefined) updateData.numberOfCompanions = numberOfCompanions;

    const updatedInvitation = await models.Invitation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedInvitation) {
      res.status(HttpStatusCode.NotFound).send({
        message: "Invitation not found."
      });
      return;
    }

    res.status(HttpStatusCode.Ok).send({
      message: "Invitation updated successfully.",
      invitation: updatedInvitation
    });
    return;
  } catch (error) {
    console.error("Error updating invitation:", error);
    next(error);
  }
}

// Delete invitation
export async function deleteInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      res.status(HttpStatusCode.BadRequest).send({
        message: "Invalid invitation ID format."
      });
      return;
    }

    const deletedInvitation = await models.Invitation.findByIdAndDelete(id).lean();

    if (!deletedInvitation) {
      res.status(HttpStatusCode.NotFound).send({
        message: "Invitation not found."
      });
      return;
    }

    res.status(HttpStatusCode.Ok).send({
      message: "Invitation deleted successfully.",
      invitation: deletedInvitation
    });
    return;
  } catch (error) {
    console.error("Error deleting invitation:", error);
    next(error);
  }
}

// Confirm invitation
export async function confirmInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { confirmed } = req.body;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      res.status(HttpStatusCode.BadRequest).send({
        message: "Invalid invitation ID format."
      });
      return;
    }

    // Validate confirmed field
    if (typeof confirmed !== "boolean") {
      res.status(HttpStatusCode.BadRequest).send({
        message: "Confirmed field must be a boolean value."
      });
      return;
    }

    const updatedInvitation = await models.Invitation.findByIdAndUpdate(
      id,
      { confirmed },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedInvitation) {
      res.status(HttpStatusCode.NotFound).send({
        message: "Invitation not found."
      });
      return;
    }

    res.status(HttpStatusCode.Ok).send({
      message: `Invitation ${confirmed ? "confirmed" : "unconfirmed"} successfully.`,
      invitation: updatedInvitation
    });
    return;
  } catch (error) {
    console.error("Error confirming invitation:", error);
    next(error);
  }
}