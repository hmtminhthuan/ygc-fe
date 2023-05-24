import React, { useEffect, useState } from "react";
import HeaderHome from "../../../component/HeaderHome/HeaderHome";
import axios from "axios";

export default function BlogSingle({
  id,
  header,
  content,
  date,
  firstName,
  ...restParams
}) {
  const param = useParams();
  const [blogSingle, setBlogSingle] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/Blog/GetBlogById", {
        params: { id: param.id },
      })
      .then((res) => {
        setBlogSingle(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <HeaderHome />
    </div>
  );
}
