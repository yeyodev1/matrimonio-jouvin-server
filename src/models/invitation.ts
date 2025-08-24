import { Schema, model, Document, Types } from "mongoose";

// Interface for Invitation document
export interface IInvitation extends Document {
  _id: Types.ObjectId;
  guestName: string;
  numberOfCompanions: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for Invitation
const invitationSchema = new Schema<IInvitation>(
  {
    guestName: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
      maxlength: [100, "Guest name cannot exceed 100 characters"]
    },
    numberOfCompanions: {
      type: Number,
      required: [true, "Number of companions is required"],
      min: [0, "Number of companions cannot be negative"],
      max: [10, "Number of companions cannot exceed 10"]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Create and export the model
const Invitation = model<IInvitation>("Invitation", invitationSchema);

export default Invitation;