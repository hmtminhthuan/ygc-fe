import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import HeaderHome from "../../../component/HeaderHome/HeaderHome";
import axios from "axios";
import image from "../../../assets/images/img-demo.jpg";
import { Link } from "react-router-dom";
import "./CourseDetail.scss";
import { Button } from "react-bootstrap";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment/moment";
// import Moment from "react-moment";
export default function CourseDetail() {
    const param = useParams();
    const [courseDetail, setCourseDetail] = useState([]);
    const [courseClasses, setCourseClasses] = useState([]);
    const formatPrice = (price) => {
        return Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };
    useEffect(() => {
        axios
            .get("http://localhost:5000/Course/GetCourseByID", {
                params: { id: param.id },
            })
            .then((res) => {
                setCourseDetail(res.data);
            })
            .catch((err) => {
                // console.log(err);
            });

        axios
            .get("http://localhost:5000/Class/GetClassByCourseID", {
                params: { courseid: param.id },
            })
            .then((res) => {
                setCourseClasses(res.data);
            })
            .catch((err) => {
                // console.log(err);
            });
    }, []);
    let { courseName, levelName, description, price, discount, ...restParams } =
        courseDetail;
    discount = 10;

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
        createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
        createData("Eclair", 262, 16.0, 24, 6.0),
        createData("Cupcake", 305, 3.7, 67, 4.3),
        createData("Gingerbread", 356, 16.0, 49, 3.9),
    ];

    return (
        <div>
            <div className="header-top m-4 mx-0 mt-0">
                <HeaderHome />
            </div>
            <main>
                <div className="box course-detail-area">
                    {/* <div className="inner-box flex"> */}
                    {/* <div className="container flex"> */}
                    <div className="course-detail-info w-100 form-container flex-column justify-content-start align-items-start p-3">
                        <h2 className="course-detail-title">{courseName}</h2>
                        <div className="row d-lg-flex align-items-stretch justify-content-center">
                            <div className="course-detail-img col-lg-5 col-10 flex justify-content-start">
                                <img className="h-100" style={{ width: "100%" }} src={image} />
                            </div>
                            <div className="course-detail-des col-lg-5 col-10 mt-lg-0 mt-sm-4 px-4 h-10">
                                <p className="course-detail-des-level">
                                    {" "}
                                    <span className="sub-title">Level: </span> {levelName}
                                </p>
                                <p className="course-detail-des-description">
                                    <span className="sub-title">Description: </span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                                    aut rem vel debitis incidunt necessitatibus, enim iure eum quo
                                    veniam voluptatibus accusantium sapiente optio ipsum? Natus
                                    doloribus hic amet ducimus.{" "}
                                </p>
                                <div className="course-detail-des-price d-flex">
                                    <span className="sub-title" style={{ margin: "0 10px 0 0" }}>
                                        Price:
                                    </span>
                                    {discount != null && discount != "" && discount >= 0 ? (
                                        <div className="d-flex">
                                            <p className="course-price-before-discount p-0">
                                                {formatPrice(price)}
                                            </p>
                                            <p className="course-price-after-discount mx-2 p-0">
                                                {formatPrice(price - (price * discount) / 100)}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="course-price my-2">{formatPrice(price)} </p>
                                    )}
                                </div>
                                <div className="flex justify-content-center mt-2">
                                    <Button className="w-75 flex">Register Now</Button>
                                </div>
                            </div>
                        </div>
                        <h2 className="sub-title course-detail-title mt-5">
                            Available Classes
                        </h2>
                        <div className="row flex align-items-stretch justify-content-center">
                            <div className="course-detail-classes col-10">
                                {courseClasses.length <= 0 ? (
                                    <p>No available class yet!</p>
                                ) : (
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    {/* <StyledTableCell>Class No.</StyledTableCell> */}
                                                    <StyledTableCell align="left">
                                                        Start Date
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        End Date
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        Trainer
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        Schedule
                                                    </StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {courseClasses.map(
                                                    (
                                                        {
                                                            classId,
                                                            trainerId,
                                                            startDate,
                                                            endDate,
                                                            firstname,
                                                            lastname,
                                                            schedule,
                                                        },
                                                        index
                                                    ) => {
                                                        return (
                                                            <StyledTableRow key={index}>
                                                                <StyledTableCell align="left">
                                                                    {moment(new Date(`${startDate}`)).format(
                                                                        "MMM Do YYYY"
                                                                    )}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">
                                                                    {moment(new Date(`${endDate}`)).format(
                                                                        "MMM Do YYYY"
                                                                    )}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">
                                                                    {firstname} {lastname}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="left">
                                                                    {schedule.map(({ date, time }, index) => (
                                                                        <p className="p-0 m-0 py-1" key={index}>
                                                                            {date}, {time}
                                                                        </p>
                                                                    ))}
                                                                </StyledTableCell>
                                                            </StyledTableRow>
                                                        );
                                                    }
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                    {/* </div> */}
                </div>
            </main>
        </div>
    );
}
