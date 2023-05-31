import React from "react";
import { useRoutes } from "react-router-dom";
import { HomeTemplate } from "../templates/HomeTemplate/HomeTemplate";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Blog from "../pages/Blogs/Blog";
import BlogPage from "../pages/Blogs/BlogSingle/BlogPage";
import Course from "../pages/Courses/Course";
import CourseDetail from "../pages/Courses/CourseDetail/CourseDetail";

import Dashboard from "../pages/Dashboard/Dashboard";
import TrainerTemplate from "../templates/TrainerTemplate/TrainerTemplate";
import TraineeTemplate from "../templates/TraineeTemplate/TraineeTemplate";
import TraineeHome from "../pages/Trainee/Home/TraineeHome";
import TrainerHome from "../pages/Trainer/Home/TrainerHome";
import AdminTemplate from "../templates/AdminTemplate/AdminTemplate";
import StaffTemplate from "../templates/StaffTemplate/StaffTemplate";
import ListTrainee from "../pages/Dashboard/ListTrainee";
import ListTrainer from "../pages/Dashboard/ListTrainer";
import CourseManagement from "../pages/Admin/CourseManagement/CourseManagement";
import UpdateTrainee from "../pages/Dashboard/Staff/UpdateTrainee";
import CreateTrainer from "../pages/Dashboard/Staff/CreateTrainer";
import FeedbackManagement from "../pages/Dashboard/Staff/Feedback/FeedbackManagement";
import AdminCourseCreate from "../pages/Admin/CourseManagement/AdminCourseCreate/AdminCourseCreate";

export default function Routers() {
  const routing = useRoutes([
    {
      path: "/",
      element: <HomeTemplate />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/course", element: <Course /> },
        { path: "/courseDetail/:id", element: <CourseDetail /> },
        { path: "/blog", element: <Blog /> },
        { path: "/blogPage/:id", element: <BlogPage /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/listTrainee", element: <ListTrainee /> },
        { path: "/listTrainer", element: <ListTrainer /> },
        { path: "/updateTrainee", element: <UpdateTrainee /> },
        { path: "/createTrainer", element: <CreateTrainer /> },
        { path: "/feedbackManagement", element: <FeedbackManagement /> },
      ],
    },
    {
      path: "/admin",
      element: <AdminTemplate />,
      children: [
        { path: "/admin", element: <Dashboard /> },
        { path: "/admin/courseManagement", element: <CourseManagement /> },
        { path: "/admin/courseManagement/createCourse", element: <AdminCourseCreate /> },
      ],
    },
    {
      path: "/staff",
      element: <StaffTemplate />,
      children: [{ path: "/staff", element: <Dashboard /> }],
    },
    {
      path: "/trainer",
      element: <TrainerTemplate />,
      children: [{ path: "/trainer", element: <TrainerHome /> }],
    },
    {
      path: "/trainee",
      element: <TraineeTemplate />,
      children: [{ path: "/trainee", element: <TraineeHome /> }],
    },
  ]);

  return routing;
}
