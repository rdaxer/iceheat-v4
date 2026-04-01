// ocr.js
// -------------------------------------------------------
// OCR-Modul für Startnummern mit Tesseract.js
// Funktioniert offline im Browser
// -------------------------------------------------------

// OCR-Worker konfigurieren
let tesseractWorker = null;

// -------------------------------------------------------
// Initialisierung
// -------------------------------------------------------
export async function initOCR() {
    if (tesseractWorker) return tesseractWorker;

    tesseractWorker = Tesseract.createWorker({
        logger: m => console.log("[OCR]", m)
    });

    console.log("OCR: Lade Sprachpaket…");
    await tesseractWorker.load();
    await tesseractWorker.loadLanguage("eng");
    await tesseractWorker.initialize("eng");

    // Nur Ziffern extrahieren
    await tesseractWorker.setParameters({
        tessedit_char_whitelist: "0123456789",
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK
    });

    console.log("OCR: bereit.");
    return tesseractWorker;
}

// -------------------------------------------------------
// OCR einer einzelnen Canvas-Zelle
// -------------------------------------------------------
export async function readNumberFromCell(canvas) {
    if (!tesseractWorker) {
        await initOCR();
    }

    const { data: { text, confidence } } = await tesseractWorker.recognize(canvas);

    let raw = text.trim();

    // Nur Ziffern extrahieren
    raw = raw.replace(/[^0-9]/g, "");

    return {
        text: raw,
        confidence
    };
}

// -------------------------------------------------------
// OCR für alle vier Fahrer eines Heats
// cells: Array von { canvas, color, x, y }
// -------------------------------------------------------
export async function readNumbersForHeat(heatCells) {
    let results = [];

    for (let c of heatCells) {

        let { text, confidence } = await readNumberFromCell(c.canvas);

        results.push({
            color: c.color,
            number: text,
            confidence: confidence,
            canvas: c.canvas
        });
    }

    return results;
}

// -------------------------------------------------------
// OCR für ein komplettes Heatschema
// groupedHeats = [{ heatNumber, gates: [...] }]
// -------------------------------------------------------
export async function readNumbersForAllHeats(groupedHeats) {

    let final = [];

    for (let heat of groupedHeats) {
        let parsed = await readNumbersForHeat(heat.gates);

        final.push({
            heatNumber: heat.heatNumber,
            gates: parsed
        });
    }

    return final;
}