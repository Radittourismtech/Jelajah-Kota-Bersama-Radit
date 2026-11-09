
/* =========================
   1. ELEMENT HTML
========================= */

const tripDestinationList = document.getElementById(
    "tripDestinationList"
);

const totalDestinations = document.getElementById(
    "totalDestinations"
);

const tripStatus = document.getElementById(
    "tripStatus"
);

const clearTripButton = document.getElementById(
    "clearTripButton"
);

const showTripMapButton = document.getElementById(
    "showTripMapButton"
);


/* =========================
   2. STATE TRIP PLANNER
========================= */

const TRIP_STORAGE_KEY = "jelajahTripPlan";

let selectedTrips = [];


/* =========================
   3. MEMUAT DATA LOCAL STORAGE
========================= */

function loadTripPlan() {

    try {

        const savedTrips = localStorage.getItem(
            TRIP_STORAGE_KEY
        );

        if (!savedTrips) {
            selectedTrips = [];
            return;
        }

        const parsedTrips = JSON.parse(savedTrips);

        if (!Array.isArray(parsedTrips)) {
            selectedTrips = [];
            return;
        }

        // Memastikan hanya ID destinasi yang tersedia
        // dan tidak ada ID duplikat

        selectedTrips = [...new Set(
            parsedTrips
                .filter(id => Number.isInteger(id))
                .filter(id =>
                    destinations.some(destination =>
                        destination.id === id
                    )
                )
        )];

    } catch (error) {

        console.error(
            "Gagal memuat Trip Planner:",
            error
        );

        selectedTrips = [];

    }

}


/* =========================
   4. MENYIMPAN DATA
========================= */

function saveTripPlan() {

    try {

        localStorage.setItem(
            TRIP_STORAGE_KEY,
            JSON.stringify(selectedTrips)
        );

    } catch (error) {

        console.error(
            "Gagal menyimpan Trip Planner:",
            error
        );

    }

}


/* =========================
   5. MENAMBAHKAN DESTINASI
========================= */

function addDestinationToTrip(destinationId) {

    const destination = destinations.find(function(item) {
        return item.id === destinationId;
    });

    if (!destination) return;

    // Mencegah destinasi yang sama ditambahkan dua kali

    if (selectedTrips.includes(destinationId)) {

        alert("Destinasi sudah ada di Trip Planner!");

        return;

    }

    selectedTrips.push(destinationId);

    saveTripPlan();

    renderTripPlan();

    alert(
        destination.name +
        " berhasil ditambahkan ke Trip Planner!"
    );

}


/* =========================
   6. MENGHAPUS DESTINASI
========================= */

function removeDestinationFromTrip(destinationId) {

    selectedTrips = selectedTrips.filter(function(id) {
        return id !== destinationId;
    });

    saveTripPlan();

    renderTripPlan();

}


/* =========================
   7. MENAMPILKAN TRIP PLAN
========================= */

function renderTripPlan() {

    tripDestinationList.innerHTML = "";

    const tripData = selectedTrips.map(function(id) {

        return destinations.find(function(destination) {
            return destination.id === id;
        });

    }).filter(Boolean);


    // Menampilkan jumlah destinasi

    totalDestinations.textContent = tripData.length;


    // Menampilkan status perjalanan

    tripStatus.textContent = tripData.length > 0
        ? "Perjalanan sedang direncanakan"
        : "Belum ada perjalanan";


    // Tampilan ketika belum ada destinasi

    if (tripData.length === 0) {

        tripDestinationList.innerHTML = `
            <div class="empty-trip">
                <p>Belum ada destinasi pilihan.</p>
                <p>Silakan tambahkan destinasi favoritmu.</p>
            </div>
        `;

        return;

    }


    // Menampilkan seluruh destinasi pilihan

    tripData.forEach(function(destination, index) {

        const tripCard = document.createElement("article");

        tripCard.className = "trip-destination-card";

        tripCard.innerHTML = `

            <div class="trip-card-number">
                ${index + 1}
            </div>

            <div class="trip-card-content">

                <h4>${destination.name}</h4>

                <p>${destination.category}</p>

                <span>${destination.location}</span>

            </div>

            <button
                class="remove-trip-button"
                data-id="${destination.id}"
                type="button"
            >
                Hapus
            </button>

        `;

        tripDestinationList.appendChild(tripCard);

    });

}


/* =========================
   8. EVENT TAMBAH DESTINASI
========================= */

destinationList.addEventListener("click", function(event) {

    const button = event.target.closest(".add-trip-button");

    if (!button) return;

    const destinationId = Number(button.dataset.id);

    addDestinationToTrip(destinationId);

});


/* =========================
   9. EVENT HAPUS DESTINASI
========================= */

tripDestinationList.addEventListener("click", function(event) {

    const button = event.target.closest(".remove-trip-button");

    if (!button) return;

    const destinationId = Number(button.dataset.id);

    removeDestinationFromTrip(destinationId);

});


/* =========================
   10. HAPUS SEMUA DESTINASI
========================= */

clearTripButton.addEventListener("click", function() {

    if (selectedTrips.length === 0) return;

    const confirmation = confirm(
        "Apakah kamu yakin ingin menghapus semua destinasi?"
    );

    if (!confirmation) return;

    selectedTrips = [];

    saveTripPlan();

    renderTripPlan();

});

/* =========================
   11. MENAMPILKAN PETA PERJALANAN
========================= */

showTripMapButton.addEventListener("click", function() {

    // Memastikan ada destinasi yang dipilih
    if (selectedTrips.length === 0) {

        alert("Tambahkan destinasi terlebih dahulu!");

        return;

    }

    // Mengambil marker berdasarkan ID destinasi pilihan
    const selectedMarkers = selectedTrips
        .map(function(id) {

            return markers.find(function(item) {
                return item.id === id;
            });

        })
        .filter(Boolean)
        .map(function(item) {
            return item.marker;
        });

    // Memastikan marker ditemukan
    if (selectedMarkers.length === 0) {

        alert("Lokasi destinasi tidak ditemukan!");

        return;

    }

    // Menampilkan bagian peta
    mapSectionShow();

    // Menyesuaikan ukuran dan posisi peta
    setTimeout(function() {

        map.invalidateSize();

        // Jika hanya ada satu destinasi
        if (selectedMarkers.length === 1) {

            map.setView(
                selectedMarkers[0].getLatLng(),
                15
            );

        } else {

            // Jika terdapat beberapa destinasi
            const group = L.featureGroup(selectedMarkers);

            map.fitBounds(group.getBounds(), {
                padding: [40, 40],
                maxZoom: 15
            });

        }

    }, 350);

});

/* =========================
   12. INISIALISASI TRIP PLANNER
========================= */

loadTripPlan();

renderTripPlan();

console.log("Trip Planner berhasil dijalankan!");
