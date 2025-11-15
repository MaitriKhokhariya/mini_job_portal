import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);