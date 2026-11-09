
/* =========================
   1. ELEMENT HTML
========================= */

const destinationList = document.getElementById("destinationList");
const destinationSection = document.getElementById("eksplorasi");
const detailSection = document.getElementById("destinationDetail");
const detailContent = document.getElementById("detailContent");
const backButton = document.getElementById("backButton");
const searchInput = document.getElementById("searchDestination");
const filterButtons = document.querySelectorAll(".filter-button");
const emptyMessage = document.getElementById("emptyMessage");
const mapSection = document.getElementById("peta");

/* =========================
   2. STATE FILTER
========================= */

let selectedCategory = "Semua";

/* =========================
   3. MENAMPILKAN DESTINASI
========================= */

function displayDestinations(data) {

    destinationList.innerHTML = "";

    emptyMessage.hidden = data.length !== 0;

    data.forEach(function(destination) {

        const card = document.createElement("article");

        card.className = "destination-card";

        card.innerHTML = `
            <img
                src="${destination.image}"
                alt="${destination.name}"
                loading="lazy"
            >

            <div class="card-content">

                <span class="card-category">
                    ${destination.category}
                </span>

                <h3>${destination.name}</h3>

                <p class="card-location">
                    ${destination.location}
                </p>

                <p class="card-description">
                    ${destination.description}
                </p>

                <button
                    class="detail-button"
                    data-id="${destination.id}"
                >
                    Lihat Detail
                </button>

            </div>
        `;

        destinationList.appendChild(card);

    });

}

/* =========================
   4. FITUR PENCARIAN
========================= */

function filterDestinations() {

    const keyword = searchInput.value.toLowerCase();

    const filteredData = destinations.filter(function(destination) {

        const matchesKeyword =
            destination.name.toLowerCase().includes(keyword) ||
            destination.location.toLowerCase().includes(keyword);

        const matchesCategory =
            selectedCategory === "Semua" ||
            destination.category === selectedCategory;

        return matchesKeyword && matchesCategory;

    });

    displayDestinations(filteredData);

}

/* =========================
   5. EVENT PENCARIAN
========================= */

searchInput.addEventListener("input", filterDestinations);

/* =========================
   6. EVENT FILTER KATEGORI
========================= */

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        selectedCategory = button.dataset.category;

        filterButtons.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        filterDestinations();

    });

});


/* =========================
   7. DETAIL DESTINASI
========================= */

destinationList.addEventListener("click", function(event) {

    const button = event.target.closest(".detail-button");

    if (!button) return;

    const destinationId = Number(button.dataset.id);

    const destination = destinations.find(function(item) {
        return item.id === destinationId;
    });

    if (!destination) return;

    // Sembunyikan daftar destinasi
    destinationSection.hidden = true;

    // Tampilkan halaman detail
    detailSection.hidden = false;

    // Masukkan informasi destinasi ke halaman detail
    detailContent.innerHTML = `

        <div class="detail-container">

            <div>
                <img
                    src="${destination.image}"
                    alt="${destination.name}"
                    class="detail-image"
                >
            </div>

            <div class="detail-information">

                <p class="eyebrow">
                    ${destination.category}
                </p>

                <h2>${destination.name}</h2>

                <p class="detail-description">
                    ${destination.description}
                </p>

                <div class="detail-info-box">
                    <h4>Lokasi Destinasi</h4>
                    <p>${destination.location}</p>
                </div>

                <div class="detail-info-box">
                    <h4>Stasiun Terdekat</h4>
                    <p>${destination.nearestStation}</p>
                </div>

                <div class="detail-info-box">
                    <h4>Akses Transportasi</h4>
                    <p>${destination.transport}</p>
                </div>

                <button class="map-button" id="showOnMap">
                    Lihat Lokasi di Peta
                </button>

            </div>

        </div>

    `;

    // Arahkan halaman ke bagian detail
    detailSection.scrollIntoView({
        behavior: "smooth"
    });

    // Event tombol menuju peta
    document.getElementById("showOnMap").addEventListener("click", function() {

        detailSection.hidden = true;

        mapSectionShow();

        map.setView([
            destination.latitude,
            destination.longitude
        ], 16);

        const marker = markers.find(function(item) {
            return item.id === destination.id;
        });

        if (marker) {
            marker.marker.openPopup();
        }

    });

});

/* =========================
   8. KEMBALI KE DESTINASI
========================= */

backButton.addEventListener("click", function() {

    detailSection.hidden = true;

    destinationSection.hidden = false;

    destinationSection.scrollIntoView({
        behavior: "smooth"
    });

});

/* =========================
   9. TAMPILKAN BAGIAN PETA
========================= */

function mapSectionShow() {

    mapSection.hidden = false;

    mapSection.scrollIntoView({
        behavior: "smooth"
    });

    setTimeout(function() {
        map.invalidateSize();
    }, 300);

}

// /* =========================
//    10. MARKER DESTINASI
// ========================= */

// const markers = [];

// destinations.forEach(function(destination) {

//     const marker = L.marker([
//         destination.latitude,
//         destination.longitude
//     ]).addTo(map);

//     marker.bindPopup(`
//         <strong>${destination.name}</strong><br>
//         ${destination.location}<br>
//         ${destination.category}
//     `);

//     markers.push({
//         id: destination.id,
//         marker: marker
//     });

// });



/* =========================
   10. TAMPILKAN DATA AWAL
========================= */

displayDestinations(destinations);

console.log("JELAJAH KOTA berhasil dijalankan!");