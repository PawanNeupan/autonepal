import mongoose, { Schema } from 'mongoose';

export interface IContactInfo {
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  mapEmbedUrl: string;
  mondayFriday: string;
  saturday: string;
  sunday: string;
}

const ContactInfoSchema = new Schema<IContactInfo>(
  {
    phone1: { type: String, default: '' },
    phone2: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    mondayFriday: { type: String, default: '9AM - 6PM' },
    saturday: { type: String, default: '9AM - 4PM' },
    sunday: { type: String, default: 'Closed' },
  },
  { timestamps: true }
);

const ContactInfo =
  mongoose.models.ContactInfo ||
  mongoose.model<IContactInfo>('ContactInfo', ContactInfoSchema);

export default ContactInfo;