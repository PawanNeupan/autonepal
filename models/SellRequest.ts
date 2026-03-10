import mongoose, { Schema } from 'mongoose';

export interface ISellRequest {
  user: mongoose.Types.ObjectId;
  make: string;
  carModel: string;
  year: number;
  color: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  condition: string;
  kmDriven: number;
  engineCC: number;
  description: string;
  overallCondition: number;
  hasAccidentHistory: boolean;
  hasServiceHistory: boolean;
  knownIssues: {
    description: string;
    photos: { url: string; publicId: string }[];
  }[];
  images: { url: string; publicId: string; order: number }[];
  video: { url: string; publicId: string };
  expectedPrice: number;
  additionalNotes: string;
  status:
    | 'pending'
    | 'under-review'
    | 'negotiating'
    | 'agreed'
    | 'rejected'
    | 'transferred-to-inventory';
  adminOffer: number;
  finalAgreedPrice: number;
  rejectionReason: string;
}

const SellRequestSchema = new Schema<ISellRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: true },
    carModel: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    bodyType: { type: String, required: true },
    condition: { type: String, required: true },
    kmDriven: { type: Number, default: 0 },
    engineCC: { type: Number, default: 0 },
    description: { type: String, default: '' },
    overallCondition: { type: Number, min: 1, max: 5, default: 3 },
    hasAccidentHistory: { type: Boolean, default: false },
    hasServiceHistory: { type: Boolean, default: false },
    knownIssues: [
      {
        description: { type: String, default: '' },
        photos: [
          {
            url: { type: String, default: '' },
            publicId: { type: String, default: '' },
          },
        ],
      },
    ],
    images: [
      {
        url: { type: String, default: '' },
        publicId: { type: String, default: '' },
        order: { type: Number, default: 0 },
      },
    ],
    video: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    expectedPrice: { type: Number, required: true },
    additionalNotes: { type: String, default: '' },
    status: {
      type: String,
      enum: [
        'pending',
        'under-review',
        'negotiating',
        'agreed',
        'rejected',
        'transferred-to-inventory',
      ],
      default: 'pending',
    },
    adminOffer: { type: Number, default: 0 },
    finalAgreedPrice: { type: Number, default: 0 },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

const SellRequest =
  mongoose.models.SellRequest ||
  mongoose.model<ISellRequest>('SellRequest', SellRequestSchema);

export default SellRequest;