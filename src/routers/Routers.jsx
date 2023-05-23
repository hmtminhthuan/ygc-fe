import React from "react";
import { useRoutes } from "react-router-dom";
import { HomeTemplate } from "../templates/HomeTemplate/HomeTemplate";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

export default function Routers() {
    const routing = useRoutes([
        {
            path: "/",
            element: <HomeTemplate />,
            children: [
                { path: "/", element: <Home /> },
                { path: "/login", element: <Login /> },
                { path: "/register", element: <Register /> },
            ],
        },
    ]);

    return routing;
}
