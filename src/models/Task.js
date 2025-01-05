import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
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
  date: {
    type: Date,
    required: true,
  },
});

taskSchema.index({ userId: 1, date: 1, position: 1 });

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
