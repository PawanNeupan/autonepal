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
  sellRequest: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  messages: INegotiationMessage[];
  status: 'active' | 'agreed' | 'rejected' | 'expired';
  finalPrice: number;
}

const NegotiationSchema = new Schema<INegotiation>(
  {
    sellRequest: {
      type: Schema.Types.ObjectId,
      ref: 'SellRequest',
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
      enum: ['active', 'agreed', 'rejected', 'expired'],
      default: 'active',
    },
    finalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Negotiation =
  mongoose.models.Negotiation ||
  mongoose.model<INegotiation>('Negotiation', NegotiationSchema);

export default Negotiation;