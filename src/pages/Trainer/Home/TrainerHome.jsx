import React from "react";
import { Link } from "react-router-dom";

export default function TrainerHome() {
    return (
        <div className="">
            <div
                className="p-5 text-center text-primary"
                style={{ fontSize: "50px" }}
            >
                TrainerHome
            </div>
            <div className="text-center">
                <Link className="" style={{ fontSize: "40px" }} to="/">HOME</Link>
            </div>
        </div>
    );
}
