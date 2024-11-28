# Course Management System

## Overview

This is a Course Management System built with Node.js and MongoDB. It provides functionalities for managing users, courses, assignments, quizzes, and grades. The system supports authentication, role-based access control, and dynamic course management features like enrollment, assignment creation, quiz submission, and more.

## Features

### User Authentication and Authorization

- **Signup**: Allows a user to register with the system.
- **Login**: Allows a registered user to log in and generate an authentication token.
- **Logout**: Allows a logged-in user to log out by invalidating the authentication token.
- **Role-based Access Control**: Different roles (`admin`, `teacher`, `student`) can access specific endpoints based on their permissions.

### Course Management

- **Create Course**: Admins can create a new course.
- **Update Course**: Admins and teachers can update course details.
- **Delete Course**: Only admins can delete a course.
- **Get All Courses**: Allows retrieving all courses available.
- **Get Course by ID**: Allows users to view course details by course ID.

### Enrollment Management

- **Enroll in Course**: Admins and students can enroll in a course.
- **My Enrollment**: Students can view their enrolled courses.
- **Remove Enrollment**: Admins can remove students from a course.

### Assignment Management

- **Create Assignment**: Teachers can create assignments for their courses.
- **Update Assignment**: Teachers can update the details of an assignment.
- **Submit Assignment**: Students can submit their assignments.
- **Update Assignment Submission**: Teachers can grade assignments submitted by students.

### Quiz Management

- **Create Quiz**: Teachers can create quizzes for their courses.
- **Submit Quiz**: Students can submit their answers for quizzes.
- **Update Quiz Submission**: Teachers can grade quiz submissions.

### Grade Management

- **Assign Grades**: Teachers can assign grades to assignments and quizzes.
- **View Grades**: Students can view their grades for assignments and quizzes.
- **Average Grade**: Students can view their average grade across courses.

### Statistics

- **Enrolled Students**: Teachers and admins can view a list of students enrolled in a course.
- **Average Grade per Course**: Calculates the average grade for all students in a course.
- **Number of Enrolled Students**: Tracks the number of students enrolled in each course.

## Tech Stack

This project uses the following technologies:

- **Node.js**: JavaScript runtime for building the backend services.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user, course, and other related data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For user authentication and authorization.
- **Cookies**: Used to store JWT tokens for secure session management.
- **dotenv**: For loading environment variables from a `.env` file.
- **BCrypt.js**: For hashing passwords securely.
- **Postman**: For API testing and documentation.

## API Endpoints

### User Routes

- `POST /user/signup`: Register a new user.
- `POST /user/login`: Login with existing credentials.
- `POST /user/logout`: Logout the current user.
- `GET /user/allusers`: Get a list of all users (only accessible by admin).

### Course Routes

- `GET /courses/all`: Get a list of all courses.
- `GET /courses/course/:id`: Get course details by ID (only accessible by logged-in users).
- `GET /courses/myenrollment`: Get a list of courses the user is enrolled in.
- `POST /courses/removeenroll`: Remove a student from a course (only accessible by admin).
- `POST /courses/assigngrades`: Assign grades to assignments or quizzes (only accessible by teachers).
- `POST /courses/createassignments`: Create an assignment (only accessible by teachers).
- `POST /courses/submitassignments`: Submit an assignment (only accessible by students).
- `POST /courses/createquiz`: Create a quiz (only accessible by teachers).
- `POST /courses/submitquiz`: Submit a quiz (only accessible by students).
- `GET /courses/viewgrade`: View grades for assignments and quizzes (only accessible by students).
- `GET /courses/averagegrade`: View the average grade for a course (only accessible by students).
- `GET /courses/enrolledstudents`: View a list of students enrolled in a course (only accessible by teachers and admins).
- `POST /courses/create`: Create a new course (only accessible by admins).
- `POST /courses/enroll/:id`: Enroll in a course (only accessible by admins and students).
- `PATCH /courses/update/:id`: Update course details (only accessible by admins and teachers).
- `PATCH /courses/updateassignments/:courseId/:assignmentId`: Update assignment details (only accessible by teachers).
- `PATCH /courses/updatequiz/:courseId/:quizId`: Update quiz details (only accessible by teachers).
- `DELETE /courses/delete/:id`: Delete a course (only accessible by admins).

## Authentication Middleware

### `auth`

- Ensures that the user is authenticated by verifying the JWT token from cookies. If no token is found or if it is invalid, the request is denied.

### `checkRole`

- Ensures that the user has the required role(s) to access a specific route. Roles include `admin`, `teacher`, and `student`.

## Token Generation

- Tokens are generated upon successful login and are stored in cookies for subsequent requests.
- The token has a lifespan of **1 day**.


## Environment Variables

- **`JWT_SECRET`**: Secret key for signing JWT tokens.
- **`PORT`**: Port for the server to run on.
- **`MONGO_URI`**: MongoDB URI to connect to the database.

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repository/course-management-system.git
   cd course-management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file:

   ```
   JWT_SECRET=your_jwt_secret
   MONGO_URI=your_mongodb_uri
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. The application will be running on the configured port, usually `http://localhost:5000`.

---

### Key Sections in the README:

- **Overview**: Provides a brief about the project and what it does.
- **Features**: Lists all the major features that the application supports.
- **API Endpoints**: Lists the routes along with their HTTP methods and descriptions of their functionality.
- **Authentication and Role-Based Access**: Describes how users authenticate and the role-based access control implemented.
- **Installation and Setup**: Provides instructions to set up the project locally.

