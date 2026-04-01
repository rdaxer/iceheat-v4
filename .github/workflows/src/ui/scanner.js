// scanner.js
// -------------------------------------------------------
// Scan-UI: verbindet OpenCV, OCR & die Heat-Rekonstruktion
// -------------------------------------------------------

import { scanHeatSchema } from "../vision/scan-engine.js";
import { buildHeatsFromCells } from "../vision/heat-reconstruction.js";
import { readNumbersForAllHeats } from "../vision/ocr.js";
import { getState, saveState } from "../state.js";

export function initScannerUI() {

    const input = document.getElementById("scanInput");
    const canvas = document.getElementById("scanCanvas");
    const statusBox = document.getElementById("scanStatus");
    const output = document.getElementById("scanOutput");
    const startBtn = document.getElementById("startScan");

    let loadedImg = null;

    input.addEventListener("change", evt => {
        const file = evt.target.files[0];
        if (!file) return;

        const img = new Image();
        img.onload = () => {
            loadedImg = img;
            drawImageScaled(img, canvas);
            statusBox.innerText = "Bild geladen.";
        };
        img.src = URL.createObjectURL(file);
    });

    startBtn.addEventListener("click", async () => {
        if (!loadedImg) {
            alert("Bitte ein Bild auswählen!");
            return;
        }

        statusBox.innerText = "Analysiere...";

        // 1. Farbzellen & ROI extrahieren
        const scan = await scanHeatSchema(loadedImg);

        // 2. Heat-Struktur rekonstrieren
        const groupedHeats = buildHeatsFromCells(scan.processed);

        statusBox.innerText = "OCR läuft...";

        // 3. Startnummern auslesen
        const withNumbers = await readNumbersForAllHeats(groupedHeats);

        // 4. In App-Format übertragen
        saveHeatDataToState(withNumbers);

        statusBox.innerText = "Scan abgeschlossen.";
        output.innerText = JSON.stringify(withNumbers, null, 2);
    });
}

// -------------------------------------------------------------------
// Speichert die rekonstruierten Heats in den globalen State
// -------------------------------------------------------------------
function saveHeatDataToState(scannedHeats) {
    const S = getState();
    S.heats = [];

    scannedHeats.forEach(h => {
        let slots = [null, null, null, null];
        let results = [null, null, null, null];

        h.gates.forEach(g => {
            let pos = colorToGateIndex(g.color);
            slots[pos] = g.number || null;
        });

        S.heats.push({
            id: crypto.randomUUID(),
            label: "Heat " + h.heatNumber,
            slots,
            results
        });
    });

    saveState();
}

// -------------------------------------------------------------------
// Farbname zu Gate-Index (Rot, Blau, Weiß, Gelb)
// -------------------------------------------------------------------
function colorToGateIndex(c) {
    switch (c) {
        case "red": return 0;
        case "blue": return 1;
        case "white": return 2;
        case "yellow": return 3;
    }
    return -1;
}

// -------------------------------------------------------------------
// Hilfsfunktion: Bild ins Canvas skalieren
// -------------------------------------------------------------------
function drawImageScaled(img, canvas) {
    const ctx = canvas.getContext("2d");

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);

    const centerShiftX = (canvas.width - img.width * ratio) / 2;
    const centerShiftY = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
    );
}