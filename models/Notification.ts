import mongoose, { Schema } from 'mongoose';

export interface INotification {
  user: mongoose.Types.ObjectId;
  type: 'order' | 'appointment' | 'offer' | 'deal' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  link: string;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['order', 'appointment', 'offer', 'deal', 'system'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;