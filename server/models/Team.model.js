import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teamCode: { type: String, unique: true, required: true },
  tagline: { type: String },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", default: null },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project",default: null },
}, { timestamps: true });

const Team = mongoose.model("Team", TeamSchema);
export default Team;
