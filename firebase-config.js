function requestLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success: User clicked "Allow"
                console.log("Latitude:", position.coords.latitude);
                console.log("Longitude:", position.coords.longitude);
            },
            (error) => {
                // Error: User clicked "Block" or closed the prompt
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        console.error("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        console.error("The request to get user location timed out.");
                        break;
                }
            }
        );
    } else {
        console.log("Geolocation is not available in this browser.");
    }
}
