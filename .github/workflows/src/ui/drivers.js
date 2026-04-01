// drivers.js
// -------------------------------------------------------
// Fahrer-Management UI
// -------------------------------------------------------

import { getState, saveState, addDriver } from "../state.js";

export function renderDrivers() {
    const S = getState();
    const list = document.getElementById("driverList");
    list.innerHTML = "";

    S.drivers.forEach(d => {
        const row = document.createElement("div");
        row.className = "driver-row";
        row.innerHTML = `
            <div class="driver-name">${d.name} (#${d.nr || "?"})</div>
            <button class="edit-btn" data-id="${d.id}">Bearbeiten</button>
        `;
        list.appendChild(row);
    });

    // Add Driver
    document.getElementById("addDriver").onclick = () => {
        addDriver();
        renderDrivers();
    };

    // Edit buttons
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            openDriverEditor(btn.dataset.id);
        });
    });
}

function openDriverEditor(id) {
    const S = getState();
    const driver = S.drivers.find(d => d.id === id);
    if (!driver) return;

    const name = prompt("Name:", driver.name);
    if (name !== null) driver.name = name;

    const nr = prompt("Startnummer:", driver.nr);
    if (nr !== null) driver.nr = nr;

    saveState();
    renderDrivers();
}