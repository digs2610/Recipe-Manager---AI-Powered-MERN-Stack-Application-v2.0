import mongoose from 'mongoose';

const accessCodeSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['trial', 'premium', 'invite', 'admin'],
    default: 'trial'
  },
  maxUses: {
    type: Number,
    default: 1
  },
  usedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usedAt: { type: Date, default: Date.now }
  }],
  expiresAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxRecipes: {
    type: Number,
    default: 10
  },
  features: [{
    type: String
  }]
}, {
  timestamps: true
});

accessCodeSchema.index({ code: 1 });
accessCodeSchema.index({ expiresAt: 1 });

const AccessCode = mongoose.model('AccessCode', accessCodeSchema);
export default AccessCode;