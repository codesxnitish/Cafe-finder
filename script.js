const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn")
const locationBtn = document.getElementById("location-btn")
const cafeList = document.getElementById("cafe-list")
const searchMessage = document.getElementById("search-message");
const cafeDetails = document.getElementById("cafe-details");

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
if(cafeList){
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
}    

function searchCafes(){
    const searchText = searchInput.value.trim().toLowerCase();

    if(searchText === ""){
        searchMessage.textContent = "Please enter a cafe name!";
        displayCafes(cafes);
        return;
    }
    const filteredCafes = cafes.filter(function(cafe){
        return cafe.name.toLowerCase().includes(searchText);
    });

    displayCafes(filteredCafes);

    if(filteredCafes.length === 0){
        searchMessage.textContent = "No cafes found.";
    }
    else{
        searchMessage.textContent = `${filteredCafes.length} cafe(s) found.`;
    }
}
searchBtn.addEventListener("click",searchCafes);

searchInput.addEventListener("keydown", function (event) {
    if(event.key === "Enter"){
        searchCafes();
    }
});
searchInput.addEventListener("input", function () {
    if (searchInput.value.trim() === "") {
        searchMessage.textContent = "";
        displayCafes(cafes);
    }
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

displayCafes(cafes);