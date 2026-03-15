# Face Expression Detector — React + face-api.js

A React app that uses your webcam to detect **7 facial expressions** in real-time using [face-api.js](https://github.com/justadudewhohacks/face-api.js) (TensorFlow.js).

| Expression | Emoji |
|---|---|
| Happy | 😊 |
| Sad | 😢 |
| Angry | 😡 |
| Surprised | 😲 |
| Neutral | 😐 |
| Fearful | 😨 |
| Disgusted | 🤢 |

---

## 1. Install packages

```bash
npm install
```

---

## 2. Download AI Models

The models are **not** bundled in the repo. Run this once to download them:

```bash
node download-models.js
```

This places the required files inside `public/models/`:

```
public/
  models/
    tiny_face_detector_model-weights_manifest.json
    tiny_face_detector_model-shard1
    face_expression_model-weights_manifest.json
    face_expression_model-shard1
    face_landmark_68_model-weights_manifest.json
    face_landmark_68_model-shard1
```

> **Manual alternative:** Download directly from  
> https://github.com/justadudewhohacks/face-api.js/tree/master/weights  
> and copy the files listed above into `public/models/`.

---

## 3. Start the app

```bash
npm run dev
```

Open http://localhost:5173 in your browser, click **Start Camera**, and allow camera access.

---

## Project structure

```
src/
  main.jsx            — React entry point
  App.jsx             — Mounts FaceExpression
  FaceExpression.jsx  — Core detection component
  FaceExpression.css  — Styles
  index.css           — Global styles
public/
  models/             — AI model files (download first)
download-models.js    — One-time model downloader
vite.config.js
package.json
```

---

## How it works

1. On mount, `face-api.js` loads three neural network models from `public/models/`.
2. Clicking **Start Camera** opens your webcam via `getUserMedia`.
3. Every 300 ms, `detectAllFaces()` runs and returns per-expression confidence scores (0–1).
4. The dominant expression and a live bar chart are rendered on screen.
5. A `<canvas>` overlay draws bounding boxes, face landmarks, and expression labels directly on the video.
