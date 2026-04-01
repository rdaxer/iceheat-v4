// heat-reconstruction.js
// -------------------------------------------------------
// Baut aus Farb-Zellen die Heats (4 Gates pro Spalte)
// -------------------------------------------------------

export function buildHeatsFromCells(cellData) {

    // Gruppierung nach Zeilenhöhe → Heat-Zuordnung
    let rows = [];
    let tolerance = 15;

    for (let c of cellData) {
        let found = rows.find(r => Math.abs(r.y - c.y) < tolerance);
        if (!found) {
            rows.push({ y: c.y, cells: [c] });
        } else {
            found.cells.push(c);
        }
    }

    rows.sort((a, b) => a.y - b.y);

    // Jede Zeile sortieren (links → rechts)
    rows.forEach(row => {
        row.cells.sort((a, b) => a.x - b.x);
    });

    // Jetzt sind rows = Fahrerzeilen
    // Spalten entsprechen Heats
    let numCols = Math.max(...rows.map(r => r.cells.length));

    let heats = [];

    for (let col = 0; col < numCols; col++) {

        let gates = [];

        for (let r = 0; r < rows.length; r++) {
            let cell = rows[r].cells[col];
            if (!cell) continue;

            if (cell.color !== "none") {
                gates.push({
                    row: r,
                    color: cell.color,
                    roi: cell.canvas
                });
            }
        }

        if (gates.length === 4) {
            heats.push({
                heatNumber: col + 1,
                gates
            });
        }
    }

    return heats;
}