// state.js
import { saveToStorage, loadFromStorage } from "./storage.js";

// Globale Referenz
const S = window.IceHeat.state;

// ---------------------------------------------------------
// State aus Storage laden
// ---------------------------------------------------------
export function loadState() {
    const saved = loadFromStorage();
    if (saved) {
        S.event = saved.event || S.event;
        S.drivers = saved.drivers || [];
        S.heats = saved.heats || [];
    }
}

// ---------------------------------------------------------
// State speichern
// ---------------------------------------------------------
export function saveState() {
    saveToStorage({
        event: S.event,
        drivers: S.drivers,
        heats: S.heats
    });
}

// ---------------------------------------------------------
// Fahrer hinzufügen
// ---------------------------------------------------------
export function addDriver(name = "Neuer Fahrer") {
    S.drivers.push({
        id: crypto.randomUUID(),
        nr: "",
        name: name,
        nation: "GER",
        photo: null
    });
    saveState();
}

// ---------------------------------------------------------
// Heat hinzufügen
// ---------------------------------------------------------
export function addHeat() {
    S.heats.push({
        id: crypto.randomUUID(),
        label: "Heat " + (S.heats.length + 1),
        slots: [null, null, null, null],
        results: [null, null, null, null]
    });
    saveState();
}

// Getter
export function getState() {
    return S;
}