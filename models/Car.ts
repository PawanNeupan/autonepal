import mongoose, { Schema, Document } from 'mongoose';

export interface ICarImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
  order: number;
}

export interface ICarIssue {
  description: string;
  photos: { url: string; publicId: string }[];
}

export interface ICar {
  title: string;
  make: string;
  carModel: string;
  year: number;
  price: number;
  color: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  transmission: 'Automatic' | 'Manual';
  bodyType: 'SUV' | 'Sedan' | 'Hatchback' | 'Pickup' | 'Van' | 'Coupe' | 'Wagon';
  condition: 'New' | 'Used' | 'Certified Pre-Owned';
  kmDriven: number;
  engineCC: number;
  description: string;
  features: string[];
  status: 'available' | 'reserved' | 'sold' | 'maintenance' | 'pending';
  isFeatured: boolean;
  source: 'inventory' | 'customer';
  images: ICarImage[];
  video: { url: string; publicId: string };
  issues: ICarIssue[];
  adminNotes: string;
  createdBy: mongoose.Types.ObjectId;
}

const CarSchema = new Schema<ICar>(
  {
    title: { type: String, required: true },
    make: { type: String, required: true },
    carModel: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      required: true,
    },
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual'],
      required: true,
    },
    bodyType: {
      type: String,
      enum: ['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'Wagon'],
      required: true,
    },
    condition: {
      type: String,
      enum: ['New', 'Used', 'Certified Pre-Owned'],
      required: true,
    },
    kmDriven: { type: Number, default: 0 },
    engineCC: { type: Number, default: 0 },
    description: { type: String, default: '' },
    features: [{ type: String }],
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold', 'maintenance', 'pending'],
      default: 'available',
    },
    isFeatured: { type: Boolean, default: false },
    source: {
      type: String,
      enum: ['inventory', 'customer'],
      default: 'inventory',
    },
    images: [
      {
        url: { type: String, default: '' },
        publicId: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      },
    ],
    video: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    issues: [
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
    adminNotes: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Car = mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);

export default Car;