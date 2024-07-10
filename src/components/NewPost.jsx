import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const NewPost = ({ image }) => {
    const { url, width, height } = image;
    const [faces, setFaces] = useState([]);

    const imgRef = useRef();
    const canvasRef = useRef();

    const handleImage = async () => {
        try {
            const detections = await faceapi.detectAllFaces(
                imgRef.current,
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: 512,
                    scoreThreshold: 0.5,
                })
            ).withFaceLandmarks().withFaceExpressions();

            setFaces(detections.map(d => ({
                box: d.detection.box,
                expressions: d.expressions
            })));
        } catch (error) {
            console.error("Error detecting faces:", error);
        }
    };

    const enter = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineWidth = 5;
        ctx.strokeStyle = "yellow";

        faces.forEach(({ box, expressions }) => {
            if (box) {
                const { x, y, width, height } = box;
                ctx.strokeRect(x, y, width, height);

                const maxExpression = Object.entries(expressions).reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: '', value: 0 });

                ctx.font = '16px Arial';
                ctx.fillStyle = 'yellow';
                ctx.fillText(maxExpression.key, x, y - 10);
            }
        });
    };

    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
                ]);
                handleImage();
            } catch (error) {
                console.error("Error loading models:", error);
            }
        };

        if (imgRef.current) {
            loadModels();
        }
    }, []);

    const saveImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Draw the original image on the canvas
        const img = imgRef.current;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw facial expressions on the canvas
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black'; // Changed font color to black
        faces.forEach(({ box, expressions }) => {
            if (box) {
                const { x, y } = box;
                const maxExpression = Object.entries(expressions).reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: '', value: 0 });
                ctx.fillStyle = 'white'; // Changed background color to white
                ctx.fillRect(x, y - 30, ctx.measureText(maxExpression.key).width, 30);
                ctx.fillStyle = 'black'; // Changed font color to black
                ctx.fillText(maxExpression.key, x, y - 10);
            }
        });

        // Download the canvas as an image
        const link = document.createElement("a");
        link.download = "image_with_expressions.png";
        link.href = canvas.toDataURL();
        link.click();
    };



    return (
        <div className="postContainer">
            <div className="imgArea">
                <div className="left" style={{ width, height }}>
                    <img ref={imgRef} crossOrigin="anonymous" src={url} alt="Post Image" />
                    <canvas
                        onMouseEnter={enter}
                        ref={canvasRef}
                        width={width}
                        height={height}
                    />
                </div>
            </div>
            <div className="right">
                <h1>Share this image now!</h1>
                <button className="rightButton" onClick={saveImage}>Download</button>
            </div>
        </div>
    );
};

export default NewPost;
