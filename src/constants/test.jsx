import React, { useEffect, useState } from "react";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

export default function test() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);

  const imageListRef = ref(storage, "testImages/");
  const uploadImage = () => {
    if (imageUpload == null) {
      return;
    }
    const imageRef = ref(storage, `testImages/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [...prev, url]);
      });
    });
  };
  useEffect(() => {
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          console.log(url);
          setImageList((prev) => [...prev, url]);
        });
      });
    });
  }, []);
  return (
    <div>
      <input type="file" onChange={(e) => setImageUpload(e.target.files[0])} />
      <button onClick={uploadImage}>Upload</button>
      {imageList.map((item, index) => {
        console.log(item);
        return <img src={item} alt={index} />;
      })}
    </div>
  );
}
