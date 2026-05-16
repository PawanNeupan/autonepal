import mongoose, { Schema } from 'mongoose';

export interface INegotiationMessage {
  sender: mongoose.Types.ObjectId;
  senderRole: 'user' | 'admin';
  type: 'text' | 'offer';
  content: string;
  offerAmount: number;
  createdAt: Date;
}

export interface INegotiation {
  car: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  offeredPrice: number;
  message: string;
  messages: INegotiationMessage[];
  status: 'pending' | 'active' | 'agreed' | 'rejected' | 'expired';
  finalPrice: number;
}

const NegotiationSchema = new Schema<INegotiation>(
  {
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    offeredPrice: { type: Number, required: true },
    message: { type: String, default: '' },
    messages: [
      {
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        senderRole: { type: String, enum: ['user', 'admin'] },
        type: { type: String, enum: ['text', 'offer'], default: 'text' },
        content: { type: String, default: '' },
        offerAmount: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'active', 'agreed', 'rejected', 'expired'],
      default: 'pending',
    },
    finalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (mongoose.models.Negotiation) {
  delete mongoose.models.Negotiation;
}

const Negotiation = mongoose.model<INegotiation>('Negotiation', NegotiationSchema);

export default Negotiation;