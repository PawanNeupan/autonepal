import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    user: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: false,
      default:  null,
    },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type:    String,
      enum:    [
        'info', 'success', 'warning', 'error',
        'order', 'appointment', 'offer', 'deal', 'system',
      ],
      default: 'info',
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Clear cached model to pick up schema changes
if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;