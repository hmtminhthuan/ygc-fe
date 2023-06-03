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
import ListTrainee from "../pages/Dashboard/Staff/Trainee/ListTrainee";
import ListTrainer from "../pages/Dashboard/Staff/Trainer/ListTrainer";
import CourseManagement from "../pages/Admin/CourseManagement/CourseManagement";

import CreateTrainer from "../pages/Dashboard/Staff/Trainer/CreateTrainer";
import CreateTrainee from "../pages/Dashboard/Staff/Trainee/CreateTrainee";
import FeedbackManagement1 from "../pages/Dashboard/Staff/Feedback/FeedbackManagement";
// import BlogManagement from "../pages/Dashboard/Staff/Blog/BlogManagement";
import AdminCourseCreate from "../pages/Admin/CourseManagement/AdminCourseCreate/AdminCourseCreate";
import ListStaff from "../pages/Admin/StaffManagement/ListStaff";
import UserProfile from "../pages/UserProfile";
import UpdateProfile from "../pages/UpdateProfile";
import AdminCourseEdit from "../pages/Admin/CourseManagement/AdminCourseEdit/AdminCourseEdit";
import FeedbackManagement from "../pages/Staff/FeedbackManagement/FeedbackManagement";
import CourseView from "../pages/Staff/CourseView/CourseView";
import CreateStaff from "../pages/Admin/StaffManagement/CreateStaff";
import BlogManagement from "../pages/Dashboard/Staff/Blog/BlogManagement";
import CreateBlog from "../pages/Dashboard/Staff/Blog/CreateBlog";
import FeedbackManagementDetail from "../pages/Staff/FeedbackManagement/FeedbackManagementDetail/FeedbackManagementDetail";
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
        { path: "/profile/:paramID", element: <UserProfile /> },
        { path: "/updateProfile/:id", element: <UpdateProfile /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/listTrainee", element: <ListTrainee /> },
        { path: "/listTrainer", element: <ListTrainer /> },
        { path: "/listStaff", element: <ListStaff /> },
        { path: "/createTrainer", element: <CreateTrainer /> },
        { path: "/createTrainee", element: <CreateTrainee /> },
        { path: "/createStaff", element: <CreateStaff /> },
        { path: "/feedbackManagement", element: <FeedbackManagement1 /> },
        { path: "/staff/feedbackManagement", element: <FeedbackManagement /> },
        {
          path: "/staff/feedbackManagement/:id",
          element: <FeedbackManagementDetail />,
        },
        { path: "/staff/course", element: <CourseView /> },
        { path: "/blogManagement", element: <BlogManagement /> },
        { path: "/createBlog", element: <CreateBlog /> },
      ],
    },
    {
      path: "/admin",
      element: <AdminTemplate />,
      children: [
        { path: "/admin", element: <Dashboard /> },
        { path: "/admin/courseManagement", element: <CourseManagement /> },
        {
          path: "/admin/courseManagement/createCourse",
          element: <AdminCourseCreate />,
        },
        {
          path: "/admin/courseManagement/editCourse/:id",
          element: <AdminCourseEdit />,
        },
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
