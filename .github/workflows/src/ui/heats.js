// heats.js
// -------------------------------------------------------
// Heat-Management UI
// -------------------------------------------------------

import { getState, saveState, addHeat } from "../state.js";

export function renderHeats() {
    const S = getState();
    const container = document.getElementById("heatList");
    container.innerHTML = "";

    S.heats.forEach(h => {
        const row = document.createElement("div");
        row.className = "heat-row";

        row.innerHTML = `
            <div class="heat-label">${h.label}</div>
            <div class="heat-slots">
                ${h.slots.map((d, i) =>
                    `<span class="slot">${d ? d : "-"}</span>`
                ).join("")}
            </div>
        `;

        container.appendChild(row);
    });

    document.getElementById("addHeat").onclick = () => {
        addHeat();
        renderHeats();
    };
}