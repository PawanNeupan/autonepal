import mongoose, { Schema } from 'mongoose';

export interface IReview {
  user: mongoose.Types.ObjectId;
  name: string;
  content: string;
  rating: number;
  isApproved: boolean;
  isFeatured: boolean;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;