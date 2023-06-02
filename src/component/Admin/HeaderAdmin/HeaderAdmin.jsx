import React from "react";
import logo from "../../../assets/images/logo.png";
import user from "../../../assets/images/user.jpg";
import { Link } from "react-router-dom";
export default function HeaderAdmin({ background, ...restParams }) {
    const USER_LOGIN = localStorage.getItem("USER_LOGIN");
    const USER = JSON.parse(USER_LOGIN);
    return (
        <section className="headerdb bg-black border-0">
            <div className="logo mt-2">
                <h2>
                    <i className="ri-menu-line icon icon-0 menu mx-2 text-light"
                        style={{ cursor: "pointer" }} />
                </h2>
                <h2 style={{ cursor: "pointer" }}
                    className="px-3"
                    onClick={() => {
                        window.location.href = '/'
                    }}>
                    <img src={logo} />
                    <span className="text-light">Yoga</span><span>Center</span>
                </h2>
            </div>
            <div className="search--notification--profile
             flex justify-content-end">
                <div className="notification--profile">
                    <div className="picon bell">
                        <i className="ri-notification-2-line" />
                    </div>

                    <div className="picon profile">
                        <img src={user} alt="" />
                    </div>
                    <div className="px-2 flex align-items-center">
                        <h5 className="p-0 px-3 m-0"
                            style={{
                                fontWeight: "800", transform: "scale(1.3)",
                                color: "rgb(227,106,200)"
                            }}>{`${USER.firstName} ${USER.lastName}`}</h5>
                    </div>

                </div>
            </div>
        </section>
    );
}
