// Compresses public/models/robot-rigged.glb in place (dedup, weld,
// resample animation keyframes, quantize attribute precision). No texture
// compression needed: the model has no embedded images, only plain PBR
// color factors (the real materials are replaced at runtime in three.js
// anyway, see src/robot/realRobotMaterials.ts).
import { NodeIO } from "@gltf-transform/core";
import { dedup, weld, quantize, resample, prune } from "@gltf-transform/functions";

const INPUT = "public/models/robot-rigged.glb";
const OUTPUT = "public/models/robot.glb";

const io = new NodeIO();

const doc = await io.read(INPUT);

await doc.transform(resample(), prune(), dedup(), weld(), quantize());

await io.write(OUTPUT, doc);

const { statSync } = await import("node:fs");
const beforeSize = statSync(INPUT).size;
const afterSize = statSync(OUTPUT).size;
console.log(`${INPUT}: ${(beforeSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`${OUTPUT}: ${(afterSize / 1024 / 1024).toFixed(2)} MB`);
