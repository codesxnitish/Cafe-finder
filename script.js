const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn")
const locationBtn = document.getElementById("location-btn")
const cafeList = document.getElementById("cafe-list")
const searchMessage = document.getElementById("search-message");

searchBtn.addEventListener("click", function(){
    const searchText = searchInput.value.trim();

    if(searchText === ""){
        searchMessage.textContent = "please enter a cafe name!";
        return;
    }

    searchMessage.textContent = "You searched for "+ searchText + "...";

    searchInput.value = "";
});
searchInput.addEventListener("input", function(){
    searchMessage.textContent="";
});
searchInput.addEventListener("keydown", function (event) {
    if(event.key === "Enter"){
        searchBtn.click();
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