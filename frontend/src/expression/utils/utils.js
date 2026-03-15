import * as faceapi from "face-api.js";

export const EXPRESSION_EMOJIS = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  surprised: "😲",
  neutral: "😐",
  fearful: "😨",
  disgusted: "🤢",
};

export const loadFaceModels = async ({ setModelsLoaded, setLoadError }) => {
  try {
    const MODEL_URL = "/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
    setModelsLoaded(true);
  } catch (err) {
    setLoadError(
      "Failed to load models. Make sure you placed the model files in public/models. " +
        "See the README for download instructions."
    );
    console.error("Model load error:", err);
  }
};

export const startCameraStream = async ({
  videoRef,
  setCameraActive,
  setLoadError,
}) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    videoRef.current.srcObject = stream;
    setCameraActive(true);
  } catch (err) {
    console.error("Camera error:", err);
    setLoadError("Could not access the camera. Please allow camera access.");
  }
};

export const stopCameraStream = ({
  intervalRef,
  videoRef,
  setCameraActive,
  setExpressions,
  setDominantExpression,
  setFaceCount,
}) => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  if (videoRef.current && videoRef.current.srcObject) {
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  }

  setCameraActive(false);
  setExpressions(null);
  setDominantExpression(null);
  setFaceCount(0);
};

export const startExpressionDetection = ({
  videoRef,
  canvasRef,
  intervalRef,
  setFaceCount,
  setExpressions,
  setDominantExpression,
  intervalMs = 300,
}) => {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
    return;
  }

  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  intervalRef.current = setInterval(async () => {
    if (!video || video.paused || video.ended) {
      return;
    }

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const resized = faceapi.resizeResults(detections, displaySize);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resized);
    faceapi.draw.drawFaceLandmarks(canvas, resized);
    faceapi.draw.drawFaceExpressions(canvas, resized);

    setFaceCount(detections.length);

    if (detections.length > 0) {
      const exprData = detections[0].expressions;
      setExpressions(exprData);

      const dominant = Object.keys(exprData).reduce((a, b) =>
        exprData[a] > exprData[b] ? a : b
      );
      setDominantExpression(dominant);
      return;
    }

    setExpressions(null);
    setDominantExpression(null);
  }, intervalMs);
};
