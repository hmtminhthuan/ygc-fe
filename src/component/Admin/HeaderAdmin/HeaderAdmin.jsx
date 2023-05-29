import React from "react";
import logo from "../../../assets/images/logo.png";
import user from "../../../assets/images/user.jpg";
import { Link } from "react-router-dom";
export default function HeaderAdmin({ background, ...restParams }) {
    return (
        <section className="headerdb">
            <div className="logo mt-2">
                <h2>
                    <i className="ri-menu-line icon icon-0 menu mx-2" />
                </h2>
                <h2>
                    <img src={logo} />
                    Yoga<span>Center</span>
                </h2>
            </div>
            <div className="search--notification--profile">
                <div className="search">
                    <input type="text" placeholder="Search..." />
                    <button>
                        <i className="ri-search-2-line" />
                    </button>
                </div>
                <div className="notification--profile">
                    <div className="picon bell">
                        <i className="ri-notification-2-line" />
                    </div>

                    <div className="picon profile">
                        <img src={user} alt="" />
                    </div>
                    <Link
                        to={"/"}
                        className="px-2 text-decoration-none text-primary bg-primary bg-opacity-25
              "
                        style={{ borderRadius: "10px", marginLeft: "20px" }}
                    >
                        Home
                    </Link>
                    <Link
                        onClick={() => {
                            localStorage.removeItem("USER_LOGIN");
                            window.location.href = "/";
                        }}
                        className="px-2 text-decoration-none text-danger bg-danger bg-opacity-25
              "
                        style={{ borderRadius: "10px", marginLeft: "20px" }}
                    >
                        Log out
                    </Link>
                </div>
            </div>
        </section>
    );
}
