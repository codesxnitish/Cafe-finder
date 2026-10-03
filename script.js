const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn")
const locationBtn = document.getElementById("location-btn")
const cafeList = document.getElementById("cafe-list")
const searchMessage = document.getElementById("search-message");
const cafeDetails = document.getElementById("cafe-details");
const ratingFilter = document.getElementById("rating-filter");
const priceFilter = document.getElementById("price-filter");
const distanceFilter = document.getElementById("distance-filter");
const openFilter = document.getElementById("open-filter");
const resetBtn = document.getElementById("reset-btn");
const resultsCount = document.getElementById("results-count");

let userLocation = null;

const map = L.map("map").setView([21.2514, 81.6296], 13);

L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function displayCafes(cafeArray) {
    cafeList.innerHTML = "";

    if (cafeArray.length === 0) {
        cafeList.innerHTML = "<p class='no-results'>No cafes found.</p>";
        return;
    }
    cafeArray.forEach(function (cafe) {
        const { id, name, rating, address, price, description } = cafe;
        const cafeCard = document.createElement("div");
        cafeCard.classList.add("cafe-card");

        cafeCard.innerHTML = `
            <h3>${name}</h3>
            <p>⭐ ${rating}</p>
            <p>📍 ${address}</p>
            <p class="description">${description}</p>
            <p>💰 ${price}</p>
            <button class="details-btn" data-id="${id}">View Details</button>
        `;

        cafeList.appendChild(cafeCard);
    });
}

function displayCafeMarkers(cafeArray) {
    cafeArray.forEach(function (cafe) {
        if (!cafe.latitude || !cafe.longitude) return;

        L.marker([cafe.latitude, cafe.longitude])
            .addTo(map)
            .bindPopup(`
                <strong>${cafe.name}</strong><br>
                ⭐ ${cafe.rating}<br>
                📍 ${cafe.address}<br>
                💰 ${cafe.price}
            `);
    });
}


function applyFilters(){
    const searchText = searchInput.value.trim().toLowerCase();
    const selectRating = ratingFilter.value;
    const selectedPrice = priceFilter.value;

    const filteredCafes = cafes.filter(function(cafe){
        const matchesSearch = cafe.name.toLowerCase().includes(searchText)||
                            cafe.address.toLowerCase().includes(searchText);
        const matchesRating = selectRating === "all" || cafe.rating>=Number(selectRating);
        
        const matchesPrice = selectedPrice === "all" || cafe.price === selectedPrice;

        return matchesSearch && matchesRating && matchesPrice;
    });

    displayCafes(filteredCafes);

    resultsCount.textContent = `Showing ${filteredCafes.length} of ${cafes.length} cafes`;

    if(filteredCafes.length === 0){
        searchMessage.textContent = "No cafes found.";
    }else{
        searchMessage.textContent ="";
    }
}
cafeList.addEventListener("click", function(event){
    if(event.target.classList.contains("details-btn")){
        const cafeId = Number(event.target.dataset.id);
        const selectedCafe = cafes.find(function(cafe){
            return cafe.id === cafeId;
        });

        if (selectedCafe && cafeDetails) {
            const {
                name,
                rating,
                address,
                price,
                description
            } = selectedCafe;

                cafeDetails.innerHTML = `
                <div class="details-card">
                <h3>${name}</h3>
               <p>⭐ Rating: ${rating}</p>
                <p>📍 Address: ${address}</p>
                <p>💰 Price: ${price}</p>
                <p>${description}</p>
            </div>
            `;
        }
    }
});   

searchBtn.addEventListener("click",applyFilters);

searchInput.addEventListener("keydown", function (event) {
    if(event.key === "Enter"){
        applyFilters();
    }
});

searchInput.addEventListener("input", applyFilters);

ratingFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);

resetBtn.addEventListener("click", function(){
    searchInput.value = "";
    ratingFilter.value = "all";
    priceFilter.value = "all";
    distanceFilter.value = "all";
    openFilter.checked = false;
    searchMessage.textContent = "";
    applyFilters();
});

locationBtn.addEventListener("click", function(){
    if(!navigator.geolocation){
        searchMessage.textContent = "Geolocation is not supported by your browser."
        return;
    }
    searchMessage.textContent = "Getting your location...";
    navigator.geolocation.getCurrentPosition(function(position){
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude: ", latitude);
            console.log("longitude: ", longitude);

            userLocation = {
                latitude: latitude,
                longitude: longitude
            };        
            searchMessage.textContent = "your location was retrieved successfully!";
            
            map.setView([latitude, longitude], 15);

            L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("📍 You are here!")
            .openPopup();
        },
            function(error){
                switch(error.code){
                    case error.PERMISSION_DENIED:
                        searchMessage.textContent = "Location permission was denied.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        searchMessage.textContent = "Location information is unavailable";
                        break;
                    case error.TIMEOUT:
                        searchMessage.textContent = "Location request timeout.";
                        break;
                    default: 
                    searchMessage.textContent = "Unable to get your location.";
                }
                console.log("Geolocation Error: ", error);
            }
        );
}   );
applyFilters();
displayCafeMarkers(cafes);