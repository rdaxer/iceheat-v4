// router.js

export function initRouter() {

    const tabs = document.querySelectorAll(".tabs button");
    const pages = document.querySelectorAll(".page");

    // Klick-Events
    tabs.forEach(btn => {
        btn.addEventListener("click", () => {
            const pageId = "page-" + btn.dataset.page;
            setActivePage(pageId);
        });
    });

    // Startseite
    setActivePage("page-drivers");

    // Page switcher
    function setActivePage(id) {
        pages.forEach(p => p.classList.remove("active"));
        document.getElementById(id).classList.add("active");

        tabs.forEach(t => t.classList.remove("active"));
        document.querySelector(`.tabs button[data-page="${id.replace("page-", "")}"]`)
            .classList.add("active");
    }

    window.IceHeat.router = { setActivePage };
}