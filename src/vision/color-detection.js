// color-detection.js
// -------------------------------------------------------
// Farbklassifikation via LAB-Farbraum
// -------------------------------------------------------

export function classifyColor(cellMat) {

    // Mittelwert der Farbe bestimmen
    let lab = new cv.Mat();
    cv.cvtColor(cellMat, lab, cv.COLOR_RGBA2Lab);

    let mean = cv.mean(lab);

    let L = mean[0];
    let A = mean[1];
    let B = mean[2];

    lab.delete();

    // FIM Speedway:
    // Rot   → hoher a-Wert (A > 155)
    // Blau  → niedriger a-Wert (A < 120) + B < 150
    // Gelb  → hoher B-Wert (B > 160)
    // Weiß  → L > 210 & sehr neutrale a/b

    if (L > 200 && A > 125 && B > 125) {
        return "white";
    }

    if (A > 155 && B < 160) {
        return "red";
    }

    if (A < 135 && B < 145) {
        return "blue";
    }

    if (B > 160) {
        return "yellow";
    }

    return "none";
}