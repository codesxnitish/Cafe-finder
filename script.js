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

function displayCafes(cafeArray){
    cafeList.innerHTML = "";

    if(cafeArray.length === 0){
        cafeList.innerHTML = "<p class = 'no-results'> No cafes found.</p>";
        return;
    }

    cafeArray.forEach(function (cafe){
        const{id,name,rating,address,price,description} = cafe;
        const cafeCard = document.createElement("div");
        cafeCard.classList.add("cafe-card");
        cafeCard.innerHTML = `
            <h3>${cafe.name}</h3>
            <p>⭐ ${cafe.rating}</p>
            <p>📍 ${cafe.address}</p>
            <p class="description">${cafe.description}</p>
            <p>💰 ${cafe.price}</p>
            <button class="details-btn" data-id="${cafe.id}">View Details</button>
            `;
            cafeList.appendChild(cafeCard);
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
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            function(position){
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log("Latitude: ", latitude);
                console.log("longitude: ", longitude);

                searchMessage.textContent = "your location was retrieved successfully!";
            },
            function(){
                searchMessage.textContent = "unable to retrieve your location.";
            }
        );
    }else{
        searchMessage.textContent = "Geolocation is not supported by your browser.";
    }
});
applyFilters();


