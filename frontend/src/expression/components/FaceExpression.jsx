import React, { useRef, useEffect, useState } from "react";
import "../style/FaceExpression.css";
import {
  EXPRESSION_EMOJIS,
  loadFaceModels,
  startCameraStream,
  startExpressionDetection,
  stopCameraStream,
} from "../utils/utils";

const FaceExpression = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [expressions, setExpressions] = useState(null);
  const [dominantExpression, setDominantExpression] = useState(null);
  const [faceCount, setFaceCount] = useState(0);

  // Load models on mount
  useEffect(() => {
    loadFaceModels({ setModelsLoaded, setLoadError });

    return () => {
      stopCameraStream({
        intervalRef,
        videoRef,
        setCameraActive,
        setExpressions,
        setDominantExpression,
        setFaceCount,
      });
    };
  }, []);

  const startCamera = async () => {
    await startCameraStream({ videoRef, setCameraActive, setLoadError });
  };

  const stopCamera = () => {
    stopCameraStream({
      intervalRef,
      videoRef,
      setCameraActive,
      setExpressions,
      setDominantExpression,
      setFaceCount,
    });
  };

  const handleVideoPlay = () => {
    startExpressionDetection({
      videoRef,
      canvasRef,
      intervalRef,
      setFaceCount,
      setExpressions,
      setDominantExpression,
    });
  };

  return (
    <div className="face-container">
      <h1 className="face-title">
        🎭 Face Expression Detector
      </h1>

      {loadError && (
        <div className="error-banner">
          <strong>⚠️ Error:</strong> {loadError}
        </div>
      )}

      {!modelsLoaded && !loadError && (
        <div className="status-banner loading">
          ⏳ Loading AI models, please wait…
        </div>
      )}

      {modelsLoaded && !loadError && (
        <div className="status-banner ready">
          ✅ Models loaded! {cameraActive ? "Camera is running." : "Start the camera to begin."}
        </div>
      )}

      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          width={640}
          height={480}
          onPlay={handleVideoPlay}
          className="face-video"
        />
        <canvas ref={canvasRef} className="face-canvas" />
      </div>

      <div className="controls">
        {!cameraActive ? (
          <button
            className="btn btn-start"
            onClick={startCamera}
            disabled={!modelsLoaded}
          >
            📷 Start Camera
          </button>
        ) : (
          <button className="btn btn-stop" onClick={stopCamera}>
            ⏹ Stop Camera
          </button>
        )}
      </div>

      {cameraActive && (
        <div className="results">
          <p className="face-count">
            👤 Faces detected: <strong>{faceCount}</strong>
          </p>

          {dominantExpression && (
            <div className="dominant">
              <span className="dominant-emoji">
                {EXPRESSION_EMOJIS[dominantExpression]}
              </span>
              <span className="dominant-label">
                {dominantExpression.toUpperCase()}
              </span>
            </div>
          )}

          {expressions && (
            <div className="expression-bars">
              {Object.entries(expressions)
                .sort(([, a], [, b]) => b - a)
                .map(([name, score]) => (
                  <div key={name} className="bar-row">
                    <span className="bar-emoji">{EXPRESSION_EMOJIS[name]}</span>
                    <span className="bar-name">{name}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${(score * 100).toFixed(1)}%` }}
                      />
                    </div>
                    <span className="bar-pct">
                      {(score * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceExpression;
