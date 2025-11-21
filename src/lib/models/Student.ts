import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  studentType: {
    type: String,
    required: true,
    enum: ['PHD', 'MASTER', 'POSTDOC'],
    default: 'MASTER'
  },
  program: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coSupervisors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  thesisTitle: {
    type: String,
    trim: true
  },
  researchArea: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  expectedEndDate: {
    type: Date,
    required: true
  },
  actualEndDate: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['ACTIVE', 'COMPLETED', 'ON_LEAVE', 'WITHDRAWN'],
    default: 'ACTIVE'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true
  },
  interests: [{
    type: String,
    trim: true
  }],
  publications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publication'
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Student || mongoose.model('Student', studentSchema);