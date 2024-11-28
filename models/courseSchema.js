const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  enrolledStudents: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      grade: { type: Number },
    },
  ],
  assignments: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      dueDate: { type: Date, required: true },
      fileUrl: { type: String },
      submissions: [
        {
          student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          fileUrl: { type: String, required: true },
          submittedAt: { type: Date, default: Date.now },
          grade: { type: Number },
        },
      ],
    },
  ],
  quizzes: [
    {
      title: { type: String, required: true },
      questions: [
        {
          questionText: { type: String, required: true },
          options: [{ type: String, required: true }],
          correctOption: { type: Number, required: true },
        },
      ],
      submissions: [
        {
          student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          answers: [{ type: Number, required: true }],
          submittedAt: { type: Date, default: Date.now },
          grade: { type: Number },
        },
      ],
    },
  ],
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
