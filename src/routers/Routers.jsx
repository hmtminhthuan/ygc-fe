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
import StaffDashboard from "../pages/Staff/StaffDashboard/StaffDashboard";
import TrainerTemplate from "../templates/TrainerTemplate/TrainerTemplate";
import TraineeTemplate from "../templates/TraineeTemplate/TraineeTemplate";
import TraineeHome from "../pages/Trainee/Home/TraineeHome";
import TrainerHome from "../pages/Trainer/Home/TrainerHome";
import AdminTemplate from "../templates/AdminTemplate/AdminTemplate";
import StaffTemplate from "../templates/StaffTemplate/StaffTemplate";
import ListTrainee from "../pages/Staff/Trainee/ListTrainee";
import ListTrainer from "../pages/Staff/Trainer/ListTrainer";
import CourseManagement from "../pages/Admin/CourseManagement/CourseManagement";
import CreateTrainer from "../pages/Staff/Trainer/CreateTrainer";
import CreateTrainee from "../pages/Staff/Trainee/CreateTrainee";
import AdminCourseCreate from "../pages/Admin/CourseManagement/AdminCourseCreate/AdminCourseCreate";
import ListStaff from "../pages/Admin/StaffManagement/ListStaff";
import UserProfile from "../pages/UserCommon/UserProfile";
import UpdateProfile from "../pages/UserCommon/UpdateProfile";
import AdminCourseEdit from "../pages/Admin/CourseManagement/AdminCourseEdit/AdminCourseEdit";
import FeedbackManagement from "../pages/Staff/FeedbackManagement/FeedbackManagement";
import CourseView from "../pages/Staff/CourseView/CourseView";
import CreateStaff from "../pages/Admin/StaffManagement/CreateStaff";
import BlogManagement from "../pages/Staff/Blog/BlogManagement";
import FeedbackManagementDetail from "../pages/Staff/FeedbackManagement/FeedbackManagementDetail/FeedbackManagementDetail";
import CreateBlog from "../pages/Staff/Blog/CreateBlog";
import UpdateBlog from "../pages/Staff/Blog/UpdateBlog";
import CommonTemplate from "../templates/CommonTemplate/CommonTemplate";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import ClassManagement from "../pages/Staff/ClassManagement/ClassManagement";
import ClassDetail from "../pages/Staff/ClassManagement/ClassDetail/ClassDetail";
import ScheduleTrainer from "../pages/Trainer/ScheduleTrainer";
import Transaction from "../pages/Trainee/Transaction";
import ScheduleTrainee from "../pages/Trainee/ScheduleTrainee";
import ClassOfTrainer from "../pages/Trainer/ClassOfTrainer";
import ClassOfTrainee from "../pages/Trainee/ClassOfTrainee";
import ChangePasswordVerifyEmail from "../pages/UserCommon/ChangePasswordVerifyEmail";
import ChangePasswordLogin from "../pages/UserCommon/ChangePasswordLogin";
import StaffClassCreate from "../pages/Staff/ClassManagement/StaffClassCreate/StaffClassCreate";
import StaffBooking from "../pages/Staff/Booking/StaffBooking";
import AdminSetting from "../pages/Admin/AdminSetting/AdminSetting";
import CourseRevenue from "../pages/Admin/CourseManagement/CourseRevenue";
import ClassMember from "../pages/Staff/ClassManagement/ClassMember/ClassMember";
import Timetable from "../pages/Staff/Timetable/Timetable";

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
        { path: "/resetPassword", element: <ChangePasswordLogin /> },
        { path: "/transaction", element: <Transaction /> },
      ],
    },
    {
      element: <CommonTemplate />,
      children: [
        { path: "/profile", element: <UserProfile /> },
        { path: "/updateProfile", element: <UpdateProfile /> },
        { path: "/changePassword", element: <ChangePasswordVerifyEmail /> },
      ],
    },
    {
      path: "/admin",
      element: <AdminTemplate />,
      children: [
        { path: "/admin", element: <AdminDashboard /> },
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
        { path: "/admin/setting", element: <AdminSetting /> },

        { path: "/admin/revenue/:id", element: <CourseRevenue /> },
      ],
    },
    {
      path: "/staff",
      element: <StaffTemplate />,
      children: [
        { path: "/staff", element: <StaffDashboard /> },
        { path: "/staff/course", element: <CourseView /> },
        { path: "/staff/listTrainee", element: <ListTrainee /> },
        { path: "/staff/listTrainer", element: <ListTrainer /> },
        { path: "/staff/createTrainer", element: <CreateTrainer /> },
        { path: "/staff/createTrainee", element: <CreateTrainee /> },
        { path: "/staff/classManagement", element: <ClassManagement /> },
        { path: "/staff/classDetail/:id", element: <ClassDetail /> },
        { path: "/staff/createClass/:id", element: <StaffClassCreate /> },
        { path: "/staff/blogManagement", element: <BlogManagement /> },
        { path: "/staff/createBlog", element: <CreateBlog /> },
        { path: "/staff/updateBlog/:id", element: <UpdateBlog /> },
        { path: "/staff/feedbackManagement", element: <FeedbackManagement /> },
        {
          path: "/staff/feedbackManagement/:id",
          element: <FeedbackManagementDetail />,
        },
        {
          path: "/staff/booking",
          element: <StaffBooking />,
        },
        {
          path: "/staff/traineeOfClass/:id/:trainerId",
          element: <ClassMember />,
        },
        {
          path: "/staff/timetable",
          element: <Timetable />,
        },
      ],
    },
    {
      path: "/trainer",
      element: <TrainerTemplate />,

      children: [
        { path: "/trainer/schedule", element: <ScheduleTrainer /> },
        { path: "/trainer/classDetail/:id", element: <ClassOfTrainer /> },
      ],
    },
    {
      path: "/trainee",
      element: <TraineeTemplate />,
      children: [
        { path: "/trainee/schedule", element: <ScheduleTrainee /> },
        { path: "/trainee/classDetail/:id", element: <ClassOfTrainee /> },
      ],
    },
  ]);

  return routing;
}
