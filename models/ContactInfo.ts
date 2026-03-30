import mongoose, { Schema } from 'mongoose';

const ContactInfoSchema = new Schema(
  {
    phone:        { type: String, default: '' },
    phone2:       { type: String, default: '' },
    email:        { type: String, default: '' },
    email2:       { type: String, default: '' },
    address:      { type: String, default: '' },
    addressNp:    { type: String, default: '' },
    mapUrl:       { type: String, default: '' },
    website:      { type: String, default: '' },
    facebook:     { type: String, default: '' },
    instagram:    { type: String, default: '' },
    youtube:      { type: String, default: '' },
    whatsapp:     { type: String, default: '' },
    tiktok:       { type: String, default: '' },
    workingHours: { type: String, default: '' },
    workingDays:  { type: String, default: '' },
  },
  { timestamps: true }
);

const ContactInfo =
  mongoose.models.ContactInfo ||
  mongoose.model('ContactInfo', ContactInfoSchema);

export default ContactInfo;