import mongoose from "mongoose";

const dumpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000,
  },
  position: {
    type: Number,
    required: true,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

dumpSchema.index({ userId: 1, date: 1, position: 1 });

const Dump = mongoose.models.Dump || mongoose.model("Dump", dumpSchema);

export default Dump;
