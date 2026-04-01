// results.js
// -------------------------------------------------------
// Ergebnis-Tabelle
// -------------------------------------------------------

import { getState } from "../state.js";

export function renderResults() {
    const S = getState();
    const container = document.getElementById("resultsTable");
    container.innerHTML = "";

    if (!S.heats.length) {
        container.innerHTML = "<p>Noch keine Heats.</p>";
        return;
    }

    let html = `
        <table class="result-table">
            <thead>
                <tr>
                    <th>Heat</th>
                    <th>Rot</th>
                    <th>Blau</th>
                    <th>Weiß</th>
                    <th>Gelb</th>
                </tr>
            </thead>
            <tbody>
    `;

    S.heats.forEach((h, idx) => {
        html += `
            <tr>
                <td>${idx + 1}</td>
                <td>${formatRes(h.results[0])}</td>
                <td>${formatRes(h.results[1])}</td>
                <td>${formatRes(h.results[2])}</td>
                <td>${formatRes(h.results[3])}</td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    container.innerHTML = html;
}

function formatRes(r) {
    if (!r && r !== 0) return "-";
    return r;
}