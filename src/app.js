// app.js
import { initRouter } from "./router.js";
import { loadState } from "./state.js";
import { renderDrivers } from "./ui/drivers.js";
import { renderHeats } from "./ui/heats.js";
import { renderResults } from "./ui/results.js";
import { initScannerUI } from "./ui/scanner.js";

window.IceHeat = {
    state: {
        event: {
            name: "Neues Event",
            location: "",
        },
        drivers: [],
        heats: [],
    }
};

// ---------------------------------------------------------
// INITIALISIERUNG
// ---------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {

    // Lade persistente Daten
    loadState();

    // Router aktivieren
    initRouter();

    // UI laden
    renderDrivers();
    renderHeats();
    renderResults();
    initScannerUI();
});