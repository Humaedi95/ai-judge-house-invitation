// SPDX-License-Identifier: MIT
// ai-judge-house-invitation — entry for the make.fun bounty
// "Convince the AI Judge to Visit Your House: A Letter in One Image".
//
// When run, this program copies the invitation letter image that ships
// with this repository (letter.jpg) to /output/entry.png, the single
// image the bounty judge evaluates.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
const sourceImage = join(repoDir, "letter.jpg");
const outputDir = "/output";
const outputImage = join(outputDir, "entry.png");

if (!existsSync(sourceImage)) {
  throw new Error(`Letter image not found: ${sourceImage}`);
}

// Validate the letter before copying: it must be a non-empty JPEG
// (magic bytes FF D8 FF) and under the 1 MiB bounty size limit.
const header = readFileSync(sourceImage).subarray(0, 3);
if (header[0] !== 0xff || header[1] !== 0xd8 || header[2] !== 0xff) {
  throw new Error(`Letter image is not a JPEG: ${sourceImage}`);
}
const sourceSize = statSync(sourceImage).size;
if (sourceSize === 0 || sourceSize > 1048576) {
  throw new Error(`Letter image size ${sourceSize} bytes is outside the 1 MiB limit`);
}
console.log(`Letter image OK: ${sourceSize} bytes`);

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourceImage, outputImage);

const size = statSync(outputImage).size;
console.log(`Wrote ${outputImage} (${size} bytes)`);
