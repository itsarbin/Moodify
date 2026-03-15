// download-models.js
// Run once with: node download-models.js
// Downloads required face-api.js model files into public/models/

import fs from "fs";
import path from "path";
import https from "https";

const BASE_URL =
  "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

const MODEL_FILES = [
  // Tiny Face Detector
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  // Face Expressions
  "face_expression_model-weights_manifest.json",
  "face_expression_model-shard1",
  // Face Landmarks 68
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
];

const OUTPUT_DIR = path.join("public", "models");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

const download = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Follow redirect
          https.get(response.headers.location, (r) => {
            r.pipe(file);
            file.on("finish", () => { file.close(); resolve(); });
          }).on("error", reject);
          return;
        }
        response.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });

(async () => {
  for (const file of MODEL_FILES) {
    const url = `${BASE_URL}/${file}`;
    const dest = path.join(OUTPUT_DIR, file);
    process.stdout.write(`Downloading ${file}... `);
    try {
      await download(url, dest);
      console.log("done");
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
    }
  }
  console.log("\nAll models downloaded to public/models/");
})();
