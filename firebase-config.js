// 1. EXPLAIN क्यों location चाहिए - यूजर को बताओ
function requestLocationWithExplanation() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="location-modal">
            <h3>Better Local Results</h3>
            <p>We use your location to show nearby stores, weather, and personalized recommendations.</p>
            <button id="allow-btn">Allow Location</button>
            <button id="deny-btn">Use Default City</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('allow-btn').onclick = () => {
        requestActualLocation();
        modal.remove();
    };
    
    document.getElementById('deny-btn').onclick = () => {
        useIPBasedLocation();
        modal.remove();
    };
}

// 2. ACTUAL location request (user के क्लिक पर)
function requestActualLocation() {
    if (!navigator.geolocation) {
        fallbackToIPLocation();
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log("Location access granted!");
            // यहाँ आपके app का logic
        },
        (error) => {
            console.log("User denied location access");
            fallbackToIPLocation();
        },
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

// 3. FALLBACK methods (जब यूजर deny कर दे)
function fallbackToIPLocation() {
    // Method 1: IP-based location (less accurate)
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            console.log("Approximate location:", data.city, data.country_name);
        });
    
    // Method 2: Ask for city manually
    const city = prompt("Please enter your city for local results:");
    if (city) {
        console.log("Using manual city:", city);
    }
}

// 4. PERMISSION STATE check (ताकि बार-बार न पूछें)
function checkPermissionState() {
    if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' })
            .then(permissionStatus => {
                if (permissionStatus.state === 'granted') {
                    console.log("Already has permission");
                } else if (permissionStatus.state === 'prompt') {
                    console.log("Can ask for permission");
                } else {
                    console.log("Permission denied, use fallback");
                }
            });
    }
}

// 5. LAZY LOADING - जब जरूरत हो तब पूछो
function lazyLocationRequest() {
    // Scroll या किसी specific action पर request करो
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) { // 500px scroll के बाद
            requestLocationWithExplanation();
            window.removeEventListener('scroll', lazyLocationRequest);
        }
    });
}

// Button click पर request
document.getElementById('locationBtn').addEventListener('click', requestLocationWithExplanation);
