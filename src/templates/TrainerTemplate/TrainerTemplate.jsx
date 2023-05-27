import React from "react";
import { Outlet } from "react-router";

export default function TrainerTemplate() {
    const USER_LOGIN = localStorage.getItem("USER_LOGIN");
    let USER = {};
    USER = JSON.parse(USER_LOGIN);
    if (USER_LOGIN == null || USER_LOGIN == undefined || !(USER.role.id == 3)) {
        window.location.href = "/";
    }
    return (
        <>
            {!(USER.role.id == 3) ? (
                <></>
            ) : (
                <div style={{}}>
                    <Outlet />
                </div>
            )}
        </>
    );
}
