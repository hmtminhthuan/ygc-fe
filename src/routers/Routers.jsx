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
import AdminCourseCreate from "../pages/Admin/CourseManagement/AdminCourseCreate/AdminCourseCreate";
import ListStaff from "../pages/Admin/StaffManagement/ListStaff";
import UserProfile from "../pages/UserCommon/UserProfile";
import UpdateProfile from "../pages/UserCommon/UpdateProfile";
import AdminCourseEdit from "../pages/Admin/CourseManagement/AdminCourseEdit/AdminCourseEdit";
import FeedbackManagement from "../pages/Staff/FeedbackManagement/FeedbackManagement";
import CourseView from "../pages/Staff/CourseView/CourseView";
import CreateStaff from "../pages/Admin/StaffManagement/CreateStaff";
import BlogManagement from "../pages/Dashboard/Staff/Blog/BlogManagement";
import FeedbackManagementDetail from "../pages/Staff/FeedbackManagement/FeedbackManagementDetail/FeedbackManagementDetail";
import CreateBlog from "../pages/Dashboard/Staff/Blog/CreateBlog";
import UpdateBlog from "../pages/Dashboard/Staff/Blog/UpdateBlog";
import CommonTemplate from "../templates/CommonTemplate/CommonTemplate";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";

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
      ],
    },
    {
      path: "/admin",
      element: <AdminTemplate />,
      children: [
        { path: "/admin", element: <AdminDashboard /> },
        { path: "/admin/dashboard", element: <AdminDashboard /> },
        { path: "/admin/listStaff", element: <ListStaff /> },
        { path: "/admin/createStaff", element: <CreateStaff /> },
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
      element: <CommonTemplate />,
      children: [
        { path: "/profile/:paramID", element: <UserProfile /> },
        { path: "/updateProfile/:id", element: <UpdateProfile /> },
      ],
    },
    {
      path: "/staff",
      element: <StaffTemplate />,
      children: [
        { path: "/staff", element: <Dashboard /> },
        { path: "/staff/dashboard", element: <Dashboard /> },
        { path: "/staff/course", element: <CourseView /> },
        { path: "/staff/listTrainee", element: <ListTrainee /> },
        { path: "/staff/listTrainer", element: <ListTrainer /> },
        { path: "/staff/createTrainer", element: <CreateTrainer /> },
        { path: "/staff/createTrainee", element: <CreateTrainee /> },
        { path: "/staff/blogManagement", element: <BlogManagement /> },
        { path: "/staff/createBlog", element: <CreateBlog /> },
        { path: "/staff/updateBlog/:id", element: <UpdateBlog /> },
        { path: "/staff/feedbackManagement", element: <FeedbackManagement /> },
        {
          path: "/staff/feedbackManagement/:id",
          element: <FeedbackManagementDetail />,
        },
      ],
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
