// import React from "react";
// import { api } from "../../../../constants/api";
// import { useFormik } from "formik";
// import { Form, Input } from "antd";
// import { TextArea } from "antd";
// import Swal from "sweetalert2";
// // import "./CreateTrainer.scss";

// export default function CreateBlog() {
//   const formItemLayout = {
//     labelCol: { xs: { span: 10 }, sm: { span: 9 } },
//     wrapperCol: { xs: { span: 10 }, sm: { span: 8 } },
//   };

//   const formik = useFormik({
//     initialValues: {
//       header: "",
//       content: "",
//       img: "",
//     },
//     onSubmit: (values, { setSubmitting, resetForm }) => {
//       api
//         .post("/Blog/CreateBlog", values)
//         .then((res) => {
//           // Account trainer created successfully
//           const createdBlog = res.data;
//           // Reset the form after successful creation
//           resetForm();
//           // setSubmitting(false);
//           Swal.fire({
//             position: "center",
//             icon: "success",
//             title: "Create new blog successfully!",
//             showConfirmButton: true,
//             timer: 3500,
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//           // setSubmitting(false);
//         });
//     },
//   });

//   return (
//     <div className="update">
//       <div className="containerud">
//         <h1 className="mt-5 mb-4">Create new blog</h1>
//         <div className="bg-white shadow rounded-lg d-sm-flex">
//           <div className="tab-content p-4 p-md-5">
//             <div className="tab-pane fade show active">
//               {/* <h3 className="mb-4">Account Settings</h3> */}
//               <Form
//                 {...formItemLayout}
//                 form={formik.form}
//                 onFinish={formik.handleSubmit}
//                 size="large"
//                 autoComplete="off"
//               >
//                 <div className="row mx-4">
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <Form.Item
//                         label="header"
//                         name="header"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Header cannot be blank",
//                           },
//                           { whitespace: true },
//                         ]}
//                         hasFeedback
//                       >
//                         <Input
//                           name="header"
//                           value={formik.values.header}
//                           onChange={formik.handleChange}
//                           placeholder="Enter Header"
//                         />
//                       </Form.Item>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <Form.Item
//                         label="content"
//                         name="content"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Content cannot be blank",
//                           },
//                           { whitespace: true },
//                         ]}
//                         hasFeedback
//                       >
//                         <TextArea
//                           name="content"
//                           value={formik.values.content}
//                           onChange={formik.handleChange}
//                           placeholder="Enter Content"
//                           autoSize={{ minRows: 3, maxRows: 6 }} // Tự điều chỉnh kích thước theo số dòng
//                         />
//                       </Form.Item>
//                     </div>
//                   </div>

//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <Form.Item
//                         label="img"
//                         name="img"
//                         rules={[
//                           {
//                             required: true,
//                             message: "Address cannot be blank",
//                           },
//                         ]}
//                         hasFeedback
//                       >
//                         <Input
//                           name="img"
//                           value={formik.values.img}
//                           onChange={formik.handleChange}
//                           placeholder="Enter img URL"
//                         />
//                       </Form.Item>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex">
//                   <Form.Item className="text-center">
//                     <button className="btn btn-primary mx-2 my-2" type="submit">
//                       Create
//                     </button>
//                     <button className="btn btn-light mx-2">Cancel</button>
//                   </Form.Item>
//                 </div>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
