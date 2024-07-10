import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import NewPost from "./components/NewPost";
import faceImg from "../src/assets/face-detection.png";

function App() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    const getImage = () => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage({
          url: img.src,
          width: img.width,
          height: img.height,
        });
      };
    };

    file && getImage();
  }, [file]);

  return (
    <div>
      <Navbar />
      {image ? (
        <NewPost image={image} />
      ) : (
        <div className="container">
          <div className="leftSection">
            <p className="title">FaceGrips</p>
            <h1>Face Expressions Detector</h1>
            <p>Welcome to <b>FaceGrips</b>, a project of <b>umscripts</b>. This app levarages advacnced facial recognition and expression detection tochnologies to analyze and interpret images in real-time. By simple uploading a photo, our app can accurately detect faces and identify their expressions, providing insightful information at a glance.</p>
            <label htmlFor="file">
              <img
                className="addImg"
                src="https://cdn.icon-icons.com/icons2/564/PNG/512/Add_Image_icon-icons.com_54218.png"
                alt=""
              />
              <p>Upload Image</p>
            </label>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              id="file"
              style={{ display: "none" }}
              type="file"
            />
          </div>
          <div className="rightSection">
            <img className="faceImg" src={faceImg} />

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
