import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String }, 
  githubRepo: { type: String },
  sdgs: [{ type: Number }], 
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
}, { timestamps: true });

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
