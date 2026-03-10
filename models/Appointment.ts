import mongoose, { Schema } from 'mongoose';

export interface IAppointment {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  type: 'buy-viewing' | 'buy-test-drive' | 'sell-inspection' | 'negotiation-meeting' | 'delivery';
  date: Date;
  timeSlot: string;
  purpose: string;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  adminNotes: string;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    type: {
      type: String,
      enum: [
        'buy-viewing',
        'buy-test-drive',
        'sell-inspection',
        'negotiation-meeting',
        'delivery',
      ],
      required: true,
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    purpose: { type: String, default: '' },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rescheduled'],
      default: 'pending',
    },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;