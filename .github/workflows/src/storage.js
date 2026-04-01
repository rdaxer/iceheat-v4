// storage.js

const KEY = "iceheat_v4_data";

// -----------------------------------------
// Speichern
// -----------------------------------------
export function saveToStorage(obj) {
    try {
        localStorage.setItem(KEY, JSON.stringify(obj));
    } catch (e) {
        console.warn("Konnte State nicht speichern:", e);
    }
}

// -----------------------------------------
// Laden
// -----------------------------------------
export function loadFromStorage() {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.warn("Konnte State nicht laden:", e);
        return null;
    }
}