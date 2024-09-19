import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { NotificationInterface } from "../interface";

const notificationSchema = new mongoose.Schema<NotificationInterface>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  typeId: { type: mongoose.Schema.Types.ObjectId },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', notificationSchema);
