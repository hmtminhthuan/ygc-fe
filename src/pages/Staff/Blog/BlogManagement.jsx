import React, { useEffect, useState } from "react";
import { Select } from "antd";
import "remixicon/fonts/remixicon.css";
import Swal from "sweetalert2";
import { api } from "../../../constants/api";
import { NavLink, useNavigate } from "react-router-dom";
import HeaderStaff from "../../../component/Staff/HeaderStaff";
import MenuStaff from "../../../component/Staff/MenuStaff";
import "./BlogManagement.scss";
import { alert } from "../../../component/AlertComponent/Alert";

export default function BlogManagement() {
  const navigate = useNavigate();
  localStorage.setItem("MENU_ACTIVE", "/staff/blogManagement");
  const [blogList, setBlogList] = useState([]);
  const [sortedBlogs, setSortedBlogs] = useState([]);
  const [dateSort, setDateSort] = useState("All");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    let timerInterval;
    Swal.fire({
      title: "Loading...",
      timer: 800,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    api
      .get("/Blog/GetBlogList")
      .then((res) => {
        setBlogList(res.data);
        setIsDataLoaded(true);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      Swal.close();
    }
  }, [isDataLoaded]);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const generateContentHTML = (content) => {
    return content
      .split("\r\n")
      .map((paragraph, index) => `${paragraph}<br />`)
      .join("");
  };

  const handleViewContent = (content) => {
    Swal.fire({
      html: generateContentHTML(content),
      heightAuto: false,
      width: "100%",
      customClass: {
        content: "text-justify",
      },
    });
  };

  useEffect(() => {
    let sortedBlogs = [...blogList];

    switch (dateSort) {
      case "all":
        sortedBlogs = [...blogList];
        break;
      case "asc":
        sortedBlogs = sortedBlogs.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });
        break;
      case "desc":
        sortedBlogs = sortedBlogs.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
        break;
      default:
        sortedBlogs = [...blogList];
        break;
    }

    setSortedBlogs(sortedBlogs);
  }, [dateSort, blogList]);

  const deleteBlog = (blogId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success mx-3",
        cancelButton: "btn btn-danger mx-3",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "Do you want to delete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
        focusConfirm: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          api
            .delete(`/Blog/DeleteBlog?id=${blogId}`)
            .then(() => {
              setBlogList((prevList) =>
                prevList.filter((blog) => blog.blogID !== blogId)
              );
              alert.alertSuccessWithTime(
                "Delete Successfully",
                "",
                2000,
                "25",
                () => {}
              );
            })
            .catch((error) => {
              alert.alertFailedWithTime(
                "Failed to delete",
                "",
                2000,
                "25",
                () => {}
              );
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          alert.alertFailedWithTime(
            "Failed to delete",
            "",
            2000,
            "25",
            () => {}
          );
        }
      });
  };

  return (
    <>
      <HeaderStaff />
      <section className="main bg-white" id="">
        <MenuStaff />
        <div className="main--content bg-white">
          <section className="staff-list-area pt-3 pb-3">
            <div className="row flex blog-containe mt-1 mx-5 mb-5">
              <div className="headerlist mb-2">
                <h1
                  className="m-0 p-0 mb-2"
                  // style={{ color: "#97a7e4" }}
                >
                  <i className="ri-bookmark-line"></i> Blogs Management
                </h1>
              </div>
              {/* Sort by date */}
              <div className="tab row">
                <div className="col-lg-6 flex mb-2 justify-content-start">
                  <h4 className="p-0 m-0 py-2 p-0 text-end px-2">
                    Sort by Date
                  </h4>
                  <div className="w-50">
                    <Select
                      className="w-100 text-dark"
                      name="date"
                      value={dateSort}
                      onChange={(value) => {
                        setDateSort(value);
                      }}
                    >
                      <Select.Option value="asc">Oldest</Select.Option>
                      <Select.Option value="desc">Latest</Select.Option>
                      <Select.Option value="all">All</Select.Option>
                    </Select>
                  </div>
                </div>
                <div className="col-lg-6 create flex mb-2 justify-content-end">
                  <NavLink
                    to={"/staff/createBlog"}
                    className="p-2 h-100 flex align-items-center justify-content-end text-decoration-none text-light"
                    style={{ borderRadius: "10px", backgroundColor: "#000" }}
                  >
                    Create new blog
                  </NavLink>
                </div>
              </div>

              <div className="blog text-justify">
                <table style={{ fontSize: "13px" }}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th></th>
                      <th>Header</th>
                      <th>Content</th>
                      <th>Image</th>
                      <th>Uploader</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBlogs.map((blog) => {
                      const formattedDate = formatDate(blog.date);
                      return (
                        <tr key={blog.blogID}>
                          <td>{`${blog.blogID}`}</td>
                          <td colSpan={2}>{formattedDate}</td>
                          <td
                            style={{ fontSize: "12px" }}
                          >{`${blog.header}`}</td>
                          <td
                            style={{ textAlign: "justify", fontSize: "12px" }}
                          >
                            {blog.content.length >= 80
                              ? blog.content.substring(0, 80).trim() + "..."
                              : blog.content}{" "}
                            {blog.content.length >= 80 ? (
                              <NavLink
                                className="view-content mr-2"
                                onClick={() => handleViewContent(blog.content)}
                              >
                                View more
                              </NavLink>
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>
                            <img
                              src={`${blog.img}`}
                              alt=""
                              style={{ width: "150px" }}
                            />
                          </td>
                          <td>
                            {`${blog.firstName}`} {`${blog.lastName}`}
                          </td>
                          <td className="setting">
                            <NavLink
                              to={`/staff/updateBlog/${blog.blogID}`}
                              className="updateInfo"
                            >
                              <i className="ri-edit-2-line mt-2 "></i>
                            </NavLink>
                          </td>
                          <td className="setting">
                            <i
                              className="ri-delete-bin-line mx-2"
                              onClick={() => deleteBlog(blog.blogID)}
                            ></i>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
