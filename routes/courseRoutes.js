const { Router } = require("express");
const {
  getCourses,
  getCourseById,
  createCourse,
  enrollCourse,
  updateCourse,
  deleteCourse,
  myEnrollment,
  removeEnrollment,
  assignGrade,
  createAssignment,
  submitAssignment,
  createQuiz,
  viewGrades,
  AverageGrade,
  submitQuiz,
  updateAssignment,
  updateQuiz,
} = require("../controllers/courseController");
const { auth, checkRole } = require("../middlewares/auth");

const courseRouter = Router();

courseRouter.get("/all", getCourses);
courseRouter.get("/course/:id", auth, getCourseById);
courseRouter.get("/myenrollment", auth, myEnrollment);
courseRouter.post(
  "/removeenroll",
  auth,
  checkRole(["admin"]),
  removeEnrollment
);
courseRouter.post("/assigngrades", auth, checkRole(["teacher"]), assignGrade);
courseRouter.post(
  "/createassignments",
  auth,
  checkRole(["teacher"]),
  createAssignment
);
courseRouter.post("/submitassignments", auth, submitAssignment);
courseRouter.post("/createquiz", auth, checkRole(["teacher"]), createQuiz);
courseRouter.post("/submitquiz", auth, checkRole(["student"]), submitQuiz);
courseRouter.get("/viewgrade", auth, checkRole(["student"]), viewGrades);
courseRouter.get("/averagegrade", auth, AverageGrade);
courseRouter.get("/enrolledstudents", auth, checkRole(["teacher", "admin"]));
courseRouter.post("/create", auth, checkRole(["admin"]), createCourse);
courseRouter.post(
  "/enroll/:id",
  auth,
  checkRole(["admin", "student"]),
  enrollCourse
);
courseRouter.patch(
  "/update/:id",
  auth,
  checkRole(["admin", "teacher"]),
  updateCourse
);
courseRouter.patch(
  "/updateassignments/:courseId/:assignmentId",
  auth,
  checkRole(["teacher"]),
  updateAssignment
);
courseRouter.patch(
  "/updatequiz/:courseId/:quizId",
  auth,
  checkRole(["teacher"]),
  updateQuiz
);
courseRouter.delete(
  "/delete/:id",
  auth,
  checkRole({ roles: ["admin"] }),
  deleteCourse
);

module.exports = courseRouter;
