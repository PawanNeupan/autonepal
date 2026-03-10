import mongoose, { Schema } from 'mongoose';

export interface IGallery {
  url: string;
  publicId: string;
  tag: 'showroom' | 'events' | 'team' | 'cars';
  order: number;
}

const GallerySchema = new Schema<IGallery>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    tag: {
      type: String,
      enum: ['showroom', 'events', 'team', 'cars'],
      default: 'showroom',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Gallery =
  mongoose.models.Gallery ||
  mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;