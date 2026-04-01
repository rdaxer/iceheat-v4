// cell-segmentation.js
// -------------------------------------------------------
// Erkennt Tabellenraster & Segmentiert die Zellen
// -------------------------------------------------------

export async function segmentCells(srcMat) {

    // 1. Graustufen
    let gray = new cv.Mat();
    cv.cvtColor(srcMat, gray, cv.COLOR_RGBA2GRAY);

    // 2. Adaptive Threshold
    let thresh = new cv.Mat();
    cv.adaptiveThreshold(
        gray, thresh,
        255,
        cv.ADAPTIVE_THRESH_MEAN_C,
        cv.THRESH_BINARY_INV,
        31, 5
    );

    // 3. Linien extrahieren (Horiz + Vert) für Raster
    let horizontal = thresh.clone();
    let vertical = thresh.clone();

    let scale = 20;

    // Horizontal
    let horizontalsize = Math.floor(horizontal.cols / scale);
    let horizontalStructure = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(horizontalsize, 1));
    cv.erode(horizontal, horizontal, horizontalStructure);
    cv.dilate(horizontal, horizontal, horizontalStructure);

    // Vertikal
    let verticalsize = Math.floor(vertical.rows / scale);
    let verticalStructure = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, verticalsize));
    cv.erode(vertical, vertical, verticalStructure);
    cv.dilate(vertical, vertical, verticalStructure);

    // 4. Kombination → Rasterstruktur
    let mask = new cv.Mat();
    cv.addWeighted(horizontal, 0.5, vertical, 0.5, 0.0, mask);

    // 5. Konturen suchen (jede Zelle = Rechteck)
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let cells = [];
    for (let i = 0; i < contours.size(); i++) {
        let cnt = contours.get(i);
        let rect = cv.boundingRect(cnt);

        // Minimale Breite/Höhe filtern für Zellen
        if (rect.width < 20 || rect.height < 20) continue;

        cells.push(rect);
    }

    gray.delete();
    thresh.delete();
    horizontal.delete();
    vertical.delete();
    mask.delete();
    contours.delete();
    hierarchy.delete();

    // Sortieren: erst Zeilen, dann Spalten
    cells.sort((a, b) => {
        if (Math.abs(a.y - b.y) > 10)
            return a.y - b.y;
        return a.x - b.x;
    });

    return cells;
}