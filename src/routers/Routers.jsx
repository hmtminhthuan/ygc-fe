import React from "react";
import { useRoutes } from "react-router-dom";
import { HomeTemplate } from "../templates/HomeTemplate/HomeTemplate";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Blog from "../pages/Blogs/Blog";
import BlogSingle from "../pages/Blogs/BlogSingle/BlogSingle";
import Course from "../pages/Courses/Course";
import CourseDetail from "../pages/Courses/CourseDetail/CourseDetail";

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
        { path: "/blogSingle/:id", element: <BlogSingle /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
      ],
    },
  ]);

  return routing;
}
