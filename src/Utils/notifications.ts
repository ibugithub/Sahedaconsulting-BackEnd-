import { UserInterface } from "../interface";
import { Notification } from "../models/notification";
import { ObjectId } from "mongodb";
export const AddNotification = async (user: UserInterface, message: string, type: string,  typeid: ObjectId) => {
  const newNotification = new Notification({
    user: user,
    message: message,
    type: type,
    typeId: typeid,
  });
  await newNotification.save();
}