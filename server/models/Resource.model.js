import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['article', 'video', 'tutorial', 'documentation', 'tool', 'library', 'github', 'book', 'course', 'other'],
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  topics: [{ 
    type: String 
  }],
  languages: [{ 
    type: String 
  }],
  frameworks: [{ 
    type: String 
  }],
  sdgs: [{ 
    type: Number,
    min: 1,
    max: 17 
  }],
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Mentor',
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1,
    max: 5,
    default: 5
  }
}, { timestamps: true });

const Resource = mongoose.model("Resource", ResourceSchema);
export default Resource; 