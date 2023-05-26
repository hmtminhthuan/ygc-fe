import React from "react";
import { Link } from "react-router-dom";

export default function TraineeHome() {
    return (
        <div className="">
            {" "}
            <div
                className="p-5 text-center text-success"
                style={{ fontSize: "50px" }}
            >
                TraineeHome
            </div>
            <div className="text-center">
                <Link className="" style={{ fontSize: "40px" }} to="/">
                    HOME
                </Link>
            </div>
        </div>
    );
}
