const Course = require("../models/courseSchema");

const createCourse = async (req, res) => {
  try {
    let { title, description, startDate, endDate, teacher } = req.body;
    const course = await Course.create({
      title,
      description,
      startDate,
      endDate,
      teacher,
    });
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .json({ message: "Failed to create course", error: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch courses", error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch course", error: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const user = req.user;
    let studentId;

    if (user.role == "student") {
      studentId = user._id;
    } else if (user.role == "admin") {
      if (req.body.studentId) {
        studentId = req.body.studentId;
      } else {
        return res
          .status(400)
          .json({ message: "Admin must provide student ID" });
      }
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.enrolledStudents.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "Already enrolled in the course" });
    }
    course.enrolledStudents.push({ student: studentId });
    await course.save();
    res.json({ success: true, message: "User enrolled successfully" });
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    res
      .status(500)
      .json({ message: "Failed to enroll user", error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const user = req.user;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (user.role == "admin") {
      course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res.json({ success: true, data: course });
    } else if (user.role == "teacher" && course.teacher == user._id) {
      let { assignment, quizzes } = req.body;

      course = await Course.findByIdAndUpdate(
        req.params.id,
        { assignment, quizzes },
        { new: true }
      );
      return res.json({ success: true, data: course });
    } else {
      return res.status(401).json({ message: " not authorise" });
    }
  } catch (error) {
    console.error("Error updating course:", error);
    res
      .status(500)
      .json({ message: "Failed to update course", error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res
      .status(500)
      .json({ message: "Failed to delete course", error: error.message });
  }
};

const myEnrollment = async (req, res) => {
  try {
    const courses = await Course.find({
      "enrolledStudents.student": req.user.id,
    })
      .populate("teacher", "username")
      .select("title description startDate endDate");

    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching enrollments", error: error.message });
  }
};

const removeEnrollment = async (req, res) => {
  const { courseId, studentId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = course.enrolledStudents.find(
      (e) => e.student.toString() === studentId
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Student not enrolled" });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      (e) => e.student.toString() !== studentId
    );

    await course.save();
    res.status(200).json({ message: "Enrollment removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing enrollment", error: error.message });
  }
};

const assignGrade = async (req, res) => {
  const { courseId, studentId, grade } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const studentEnrollment = course.enrolledStudents.find(
      (e) => e.student.toString() === studentId
    );

    if (!studentEnrollment) {
      return res
        .status(404)
        .json({ message: "Student not enrolled in this course" });
    }

    studentEnrollment.grade = grade;
    await course.save();
    res.status(200).json({ message: "Grade assigned successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning grade", error: error.message });
  }
};

const createAssignment = async (req, res) => {
  const { courseId, title, description, dueDate, fileUrl } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to add assignment" });
    }

    const newAssignment = {
      title,
      description,
      dueDate,
      fileUrl,
    };

    course.assignments.push(newAssignment);
    await course.save();
    res.status(201).json({ message: "Assignment created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating assignment", error: error.message });
  }
};

const submitAssignment = async (req, res) => {
  const { courseId, assignmentId, fileUrl } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    console.log("course:" + course);

    const assignment = course.assignments.id(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const submission = {
      student: req.user.id,
      fileUrl,
    };

    assignment.submissions.push(submission);
    await course.save();
    res.status(201).json({ message: "Assignment submitted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting assignment", error: error.message });
  }
};
const createQuiz = async (req, res) => {
  const { courseId, title, questions } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to add quiz" });
    }

    const newQuiz = {
      title,
      questions,
    };

    course.quizzes.push(newQuiz);
    await course.save();
    res.status(201).json({ message: "Quiz created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating quiz", error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  const { courseId, quizId, answers } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const quiz = course.quizzes.id(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const submission = {
      student: req.user.id,
      answers,
    };

    quiz.submissions.push(submission);
    await course.save();
    res.status(201).json({ message: "Quiz submitted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting quiz", error: error.message });
  }
};

const viewGrades = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $match: { "enrolledStudents.student": req.user.id },
      },
      {
        $unwind: "$enrolledStudents",
      },
      {
        $match: { "enrolledStudents.student": req.user.id },
      },
      {
        $project: {
          title: 1,
          grade: "$enrolledStudents.grade",
        },
      },
    ]);

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found or no grades available." });
    }

    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching grades", error: error.message });
  }
};

const AverageGrade = async (req, res) => {
  try {
    const statistics = await Course.aggregate([
      {
        $unwind: "$enrolledStudents",
      },
      {
        $group: {
          _id: "$title",
          averageGrade: { $avg: "$enrolledStudents.grade" },
          numberOfStudents: { $sum: 1 },
        },
      },
      {
        $project: {
          courseTitle: "$_id",
          averageGrade: 1,
          numberOfStudents: 1,
        },
      },
    ]);

    if (statistics.length === 0) {
      return res
        .status(404)
        .json({ message: "No course statistics available." });
    }

    res.status(200).json(statistics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error calculating statistics", error: error.message });
  }
};

const EnrolledStudents = async (req, res) => {
  try {
    const statistics = await Course.aggregate([
      {
        $project: {
          courseTitle: "$title",
          enrolledStudentsCount: { $size: "$enrolledStudents" },
        },
      },
    ]);

    if (statistics.length === 0) {
      return res
        .status(404)
        .json({ message: "No enrolled student statistics available." });
    }

    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({
      message: "Error calculating number of enrolled students",
      error: error.message,
    });
  }
};

const updateAssignment = async (req, res) => {
  const { courseId, assignmentId } = req.params;
  const { title, description, dueDate, fileUrl } = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.teacher.equals(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update assignments" });
    }

    const assignment = course.assignments.id(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.fileUrl = fileUrl || assignment.fileUrl;

    await course.save();

    res
      .status(200)
      .json({ message: "Assignment updated successfully", assignment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating assignment", error: error.message });
  }
};

const updateQuiz = async (req, res) => {
  const { courseId, quizId } = req.params;
  const { title, questions } = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found!!" });
    }

    if (!course.teacher.equals(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update quizzes!!" });
    }

    const quiz = course.quizzes.id(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found!!" });
    }

    quiz.title = title || quiz.title;
    if (questions && Array.isArray(questions)) {
      quiz.questions = questions;
    }

    await course.save();

    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating quiz", error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  myEnrollment,
  removeEnrollment,
  assignGrade,
  createAssignment,
  submitAssignment,
  createQuiz,
  submitQuiz,
  viewGrades,
  AverageGrade,
  EnrolledStudents,
  updateAssignment,
  updateQuiz,
};
