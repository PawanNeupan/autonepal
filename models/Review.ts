import mongoose, { Schema } from 'mongoose';

export interface IReview {
  user?: mongoose.Types.ObjectId;
  name?: string;
  comment?: string;
  rating: number;
  car?: mongoose.Types.ObjectId;
  isApproved: boolean;
  isFeatured: boolean;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    comment: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    car: { type: Schema.Types.ObjectId, ref: 'Car' },
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (mongoose.models.Review) {
  delete mongoose.models.Review;
}
const Review = mongoose.model<IReview>('Review', ReviewSchema);

export default Review;