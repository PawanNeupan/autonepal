import mongoose, { Schema } from 'mongoose';

export interface IFavorite {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  },
  { timestamps: true }
);

const Favorite =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;