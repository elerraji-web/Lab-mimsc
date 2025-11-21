import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  abstract: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['JOURNAL_ARTICLE', 'CONFERENCE_PAPER', 'BOOK_CHAPTER', 'BOOK', 'THESIS', 'REPORT', 'PREPRINT'],
    default: 'JOURNAL_ARTICLE'
  },
  authors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  journal: {
    type: String,
    trim: true
  },
  conference: {
    type: String,
    trim: true
  },
  volume: {
    type: String,
    trim: true
  },
  issue: {
    type: String,
    trim: true
  },
  pages: {
    type: String,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  doi: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  url: {
    type: String,
    trim: true
  },
  publishedAt: {
    type: Date
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  researchArea: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  citations: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

publicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Publication || mongoose.model('Publication', publicationSchema);