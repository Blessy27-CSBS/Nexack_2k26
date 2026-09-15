import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Clock' },
  displayOrder: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Unpublished'], 
    default: 'Published' 
  }
}, { timestamps: true });

timelineEventSchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('TimelineEvent', timelineEventSchema);
