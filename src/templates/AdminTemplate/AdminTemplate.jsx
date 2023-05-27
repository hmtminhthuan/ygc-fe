import React from 'react'
import { Outlet } from 'react-router';

export default function AdminTemplate() {
    const USER_LOGIN = localStorage.getItem("USER_LOGIN");
    let USER = {};
    USER = JSON.parse(USER_LOGIN);
    if (USER_LOGIN == null || USER_LOGIN == undefined || !(USER.role.id == 1)) {
        window.location.href = "/";
    }
    return (
        <>
            {!(USER.role.id == 1) ? (
                <></>
            ) : (
                <div style={{}}>
                    <Outlet />
                </div>
            )}
        </>
    );
}
