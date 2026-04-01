// scan-engine.js
// -------------------------------------------------------
// Hauptmodul: nimmt ein Bild, findet Zellen, erkennt Farben
// -------------------------------------------------------

import { segmentCells } from "./cell-segmentation.js";
import { classifyColor } from "./color-detection.js";

// Lädt ein Bild in eine OpenCV-Matrix
export async function loadImageToMat(imageElement) {
    let src = cv.imread(imageElement);
    return src;
}

export async function scanHeatSchema(imageElement) {

    let srcMat = await loadImageToMat(imageElement);
    let cells = await segmentCells(srcMat);

    let results = [];

    for (let rect of cells) {

        let roi = srcMat.roi(new cv.Rect(rect.x, rect.y, rect.width, rect.height));

        // Farbe klassifizieren
        let color = classifyColor(roi);

        // ROI für OCR später vorbereiten
        let roiCanvas = document.createElement("canvas");
        cv.imshow(roiCanvas, roi);

        results.push({
            x: rect.x,
            y: rect.y,
            w: rect.width,
            h: rect.height,
            color: color,
            canvas: roiCanvas
        });

        roi.delete();
    }

    srcMat.delete();

    return {
        cells,
        processed: results
    };
}