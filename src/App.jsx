import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import NewPost from "./components/NewPost";
import faceImg from "../src/assets/face-detection.png";
import Footer from "./components/Footer";

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
            <h1>FaceGrips</h1>
            <p id="intoHead">Face Expressions Detector</p>
            <p id="introPara">
              Welcome to <b>FaceGrips</b>, a project of <a href="https://umscripts.netlify.app">umscripts</a>. This app leverages
              advanced facial recognition and expression detection technologies
              to analyze and interpret images in real-time. By simply uploading
              a photo, our app can accurately detect faces and identify their
              expressions, providing insightful information at a glance.
            </p>
            {/* Label triggers hidden file input */}
            <label htmlFor="file" className="uploadBtn">
              <img
                className="addImg"
                src="https://www.pngplay.com/wp-content/uploads/8/Upload-Icon-Image-Background-PNG-Image.png"
                alt="upload"
              />
              Upload Image
            </label>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              id="file"
              style={{ display: "none" }}
              type="file"
            />
          </div>
          <img className="faceImg" src={faceImg} alt="face detection" />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
