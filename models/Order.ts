import mongoose, { Schema } from 'mongoose';

export interface IOrder {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  status: 'pending' | 'reserved' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: 'esewa' | 'cod' | 'half-esewa-half-cod';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  esewaAmount: number;
  codAmount: number;
  totalAmount: number;
  esewaTransactionId: string;
  esewaRefId: string;
  notes: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    status: {
      type: String,
      enum: ['pending', 'reserved', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['esewa', 'cod', 'half-esewa-half-cod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid',
    },
    esewaAmount: { type: Number, default: 0 },
    codAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    esewaTransactionId: { type: String, default: '' },
    esewaRefId: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;