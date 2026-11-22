/* ==========================================
   CONGO MOTORS V2
   CATALOGUE AUTOMOBILE
========================================== */


/* ==========================================
   1. CONFIGURATION
========================================== */

const WHATSAPP_NUMBER = "242067933469";


/* ==========================================
   2. LISTE DES MARQUES
========================================== */

const brands = [
    "Toyota",
    "Suzuki",
    "Kia",
    "Hyundai",
    "Lexus",
    "Nissan",
    "Mercedes-Benz",
    "BMW",
    "Land Rover",
    "Jetour"
];


/* ==========================================
   3. LISTE DES VÉHICULES

   C'EST ICI QUE TU AJOUTERAS TES VOITURES.

   Copie un objet existant et modifie
   ses informations.
========================================== */

const vehicles = [

    {
        id: 1,
        brand: "Toyota",
        model: "Land Cruiser Prado",
        year: 2024,
        price: 45000000,
        condition: "Occasion",
        mileage: 15000,
        fuel: "Diesel",
        transmission: "Automatique",
        image: "images/prado.jpg",
        description: "Toyota Land Cruiser Prado en excellent état. Confort, puissance et élégance."
    },

    {
        id: 2,
        brand: "Mercedes-Benz",
        model: "GLE 450",
        year: 2023,
        price: 55000000,
        condition: "Occasion",
        mileage: 12000,
        fuel: "Essence",
        transmission: "Automatique",
        image: "images/gle.jpg",
        description: "Mercedes-Benz GLE 450. Un SUV premium alliant confort et performance."
    },

    {
        id: 3,
        brand: "BMW",
        model: "X5",
        year: 2025,
        price: 68000000,
        condition: "Neuf",
        mileage: 0,
        fuel: "Essence",
        transmission: "Automatique",
        image: "images/bmw-x5.jpg",
        description: "BMW X5 neuve, élégante, puissante et confortable."
    }

];


/* ==========================================
   4. ÉLÉMENTS HTML
========================================== */

const brandsGrid = document.getElementById("brands-grid");

const vehiclesGrid = document.getElementById("vehicles-grid");

const searchInput = document.getElementById("vehicle-search");

const conditionFilter = document.getElementById("condition-filter");

const resetFilterButton = document.getElementById("reset-filter");

const catalogueTitle = document.getElementById("catalogue-title");

const vehicleCount = document.getElementById("vehicle-count");

const catalogueEmpty = document.getElementById("catalogue-empty");

const vehicleModal = document.getElementById("vehicle-modal");

const vehicleModalBody = document.getElementById("vehicle-modal-body");

const modalClose = document.getElementById("modal-close");


/* ==========================================
   5. VARIABLES DE FILTRAGE
========================================== */

let selectedBrand = "";

let selectedVehicle = null;


/* ==========================================
   6. OUTILS
========================================== */

function formatPrice(price) {

    if (!price || price <= 0) {
        return "Prix sur demande";
    }

    return new Intl.NumberFormat("fr-FR")
        .format(price) + " FCFA";

}


function formatMileage(mileage) {

    return new Intl.NumberFormat("fr-FR")
        .format(mileage) + " km";

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function getWhatsAppLink(vehicle) {

    const message = `
Bonjour Congo Motors,

Je suis intéressé par le véhicule suivant :

Marque : ${vehicle.brand}
Modèle : ${vehicle.model}
Année : ${vehicle.year}
Prix : ${formatPrice(vehicle.price)}

Pourriez-vous me donner plus d'informations ?

Merci.
    `.trim();

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

}


/* ==========================================
   7. AFFICHAGE DES MARQUES
========================================== */

function renderBrands() {

    if (!brandsGrid) return;

    brandsGrid.innerHTML = brands.map(brand => {

        const brandVehicles = vehicles.filter(
            vehicle => vehicle.brand === brand
        );

        const isActive = selectedBrand === brand;

        return `
            <button
                class="brand-card ${isActive ? "active" : ""}"
                type="button"
                data-brand="${escapeHTML(brand)}"
            >

                <span>${escapeHTML(brand)}</span>

                <small>
                    ${brandVehicles.length}
                    ${brandVehicles.length === 1 ? "véhicule" : "véhicules"}
                </small>

            </button>
        `;

    }).join("");

}


/* ==========================================
   8. CRÉATION D'UNE CARTE VOITURE
========================================== */

function createVehicleCard(vehicle) {

    return `
        <article class="vehicle-card">

            <div class="vehicle-image">

                <img
                    src="${escapeHTML(vehicle.image)}"
                    alt="${escapeHTML(vehicle.brand + " " + vehicle.model)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='images/default-car.jpg';"
                >

                <span class="vehicle-condition">
                    ${escapeHTML(vehicle.condition)}
                </span>

            </div>

            <div class="vehicle-info">

                <span class="vehicle-brand">
                    ${escapeHTML(vehicle.brand)}
                </span>

                <h3>
                    ${escapeHTML(vehicle.model)}
                </h3>

                <span class="vehicle-year">
                    Année ${escapeHTML(vehicle.year)}
                </span>

                <div class="vehicle-specs">

                    <span>
                        ${escapeHTML(vehicle.fuel)}
                    </span>

                    <span>
                        ${escapeHTML(vehicle.transmission)}
                    </span>

                    <span>
                        ${formatMileage(vehicle.mileage)}
                    </span>

                </div>

                <div class="vehicle-price">
                    ${formatPrice(vehicle.price)}
                </div>

                <div class="vehicle-actions">

                    <button
                        class="details-button"
                        type="button"
                        data-details="${vehicle.id}"
                    >
                        Voir les détails
                    </button>

                    <a
                        class="contact-button"
                        href="${getWhatsAppLink(vehicle)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        WhatsApp
                    </a>

                </div>

            </div>

        </article>
    `;

}


/* ==========================================
   9. FILTRAGE DU CATALOGUE
========================================== */

function getFilteredVehicles() {

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const condition = conditionFilter
        ? conditionFilter.value
        : "";

    return vehicles.filter(vehicle => {

        const matchesBrand = selectedBrand
            ? vehicle.brand === selectedBrand
            : true;

        const searchableText = `
            ${vehicle.brand}
            ${vehicle.model}
            ${vehicle.year}
            ${vehicle.fuel}
            ${vehicle.condition}
        `.toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesCondition = condition
            ? vehicle.condition === condition
            : true;

        return matchesBrand && matchesSearch && matchesCondition;

    });

}


/* ==========================================
   10. AFFICHAGE DU CATALOGUE
========================================== */

function renderVehicles() {

    if (!vehiclesGrid) return;

    const filteredVehicles = getFilteredVehicles();

    vehiclesGrid.innerHTML = filteredVehicles
        .map(createVehicleCard)
        .join("");

    if (vehicleCount) {

        vehicleCount.textContent =
            `${filteredVehicles.length} ` +
            `${filteredVehicles.length === 1 ? "véhicule" : "véhicules"}`;

    }

    if (catalogueTitle) {

        catalogueTitle.textContent = selectedBrand
            ? `Nos ${selectedBrand}`
            : "Tous nos véhicules";

    }

    if (catalogueEmpty) {

        catalogueEmpty.style.display =
            filteredVehicles.length === 0
                ? "block"
                : "none";

    }

    vehiclesGrid.style.display =
        filteredVehicles.length === 0
            ? "none"
            : "grid";

}


/* ==========================================
   11. SÉLECTION D'UNE MARQUE
========================================== */

function selectBrand(brand) {

    selectedBrand = brand;

    renderBrands();

    renderVehicles();

    // Amène le visiteur vers le catalogue
    document.getElementById("catalogue")
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* ==========================================
   12. RÉINITIALISATION DES FILTRES
========================================== */

function resetFilters() {

    selectedBrand = "";

    if (searchInput) {
        searchInput.value = "";
    }

    if (conditionFilter) {
        conditionFilter.value = "";
    }

    renderBrands();

    renderVehicles();

}


/* ==========================================
   13. FICHE DÉTAILLÉE
========================================== */

function openVehicleModal(vehicleId) {

    selectedVehicle = vehicles.find(
        vehicle => vehicle.id === Number(vehicleId)
    );

    if (!selectedVehicle) return;

    const vehicle = selectedVehicle;

    vehicleModalBody.innerHTML = `

        <img
            class="modal-image"
            src="${escapeHTML(vehicle.image)}"
            alt="${escapeHTML(vehicle.brand + " " + vehicle.model)}"
            onerror="this.onerror=null;this.src='images/default-car.jpg';"
        >

        <div class="modal-info">

            <span class="vehicle-brand">
                ${escapeHTML(vehicle.brand)}
            </span>

            <h2>
                ${escapeHTML(vehicle.model)}
            </h2>

            <p class="vehicle-year">
                ${escapeHTML(vehicle.year)}
            </p>

            <div class="vehicle-price">
                ${formatPrice(vehicle.price)}
            </div>

            <div class="vehicle-specs">

                <span>
                    État : ${escapeHTML(vehicle.condition)}
                </span>

                <span>
                    Kilométrage : ${formatMileage(vehicle.mileage)}
                </span>

                <span>
                    Carburant : ${escapeHTML(vehicle.fuel)}
                </span>

                <span>
                    Transmission : ${escapeHTML(vehicle.transmission)}
                </span>

            </div>

            <p class="modal-description">
                ${escapeHTML(vehicle.description)}
            </p>

            <a
                href="${getWhatsAppLink(vehicle)}"
                class="modal-contact"
                target="_blank"
                rel="noopener noreferrer"
            >
                Contacter Congo Motors
            </a>

        </div>

    `;

    vehicleModal.classList.add("open");

    document.body.style.overflow = "hidden";

}


/* ==========================================
   14. FERMETURE DE LA FICHE
========================================== */

function closeVehicleModal() {

    vehicleModal.classList.remove("open");

    document.body.style.overflow = "";

}


/* ==========================================
   15. ÉVÉNEMENTS
========================================== */

// Clic sur les marques
brandsGrid?.addEventListener("click", event => {

    const brandButton = event.target.closest("[data-brand]");

    if (!brandButton) return;

    selectBrand(brandButton.dataset.brand);

});


// Recherche
searchInput?.addEventListener("input", renderVehicles);


// Filtre neuf / occasion
conditionFilter?.addEventListener("change", renderVehicles);


// Bouton toutes les marques
resetFilterButton?.addEventListener("click", resetFilters);


// Bouton détails
vehiclesGrid?.addEventListener("click", event => {

    const detailsButton = event.target.closest("[data-details]");

    if (!detailsButton) return;

    openVehicleModal(detailsButton.dataset.details);

});


// Fermeture de la modale
modalClose?.addEventListener("click", closeVehicleModal);


// Fermeture en cliquant sur le fond
vehicleModal?.addEventListener("click", event => {

    if (event.target === vehicleModal) {
        closeVehicleModal();
    }

});


// Fermeture avec Escape
document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeVehicleModal();
    }

});


/* ==========================================
   16. INITIALISATION
========================================== */

function initializeCatalogue() {

    console.log("Congo Motors : catalogue initialisé.");

    renderBrands();

    renderVehicles();

}

initializeCatalogue();