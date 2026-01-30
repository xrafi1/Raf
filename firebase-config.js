// Enhanced location service with better user experience
class LocationService {
    constructor() {
        this.userLocation = null;
        this.permissionStatus = 'not-requested';
        this.init();
    }

    init() {
        // Check if geolocation is supported
        this.isSupported = !!navigator.geolocation;
        console.log("Geolocation supported:", this.isSupported);
    }

    // Main function to request location with user-friendly approach
    async requestUserLocation(options = {}) {
        if (!this.isSupported) {
            this.showMessage("Location services are not supported in your browser.");
            return this.useFallbackLocation();
        }

        // Update UI to show we're requesting
        this.showLoadingState();
        
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // SUCCESS: User clicked "Allow"
                    this.handleSuccess(position, resolve);
                },
                (error) => {
                    // ERROR: User clicked "Block" or error occurred
                    this.handleError(error, resolve, reject);
                },
                {
                    enableHighAccuracy: options.highAccuracy || false,
                    timeout: options.timeout || 10000,
                    maximumAge: options.maximumAge || 0
                }
            );
        });
    }

    handleSuccess(position, resolve) {
        this.permissionStatus = 'granted';
        this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
        };

        console.log("✅ Location Access Granted");
        console.log("📍 Lat:", this.userLocation.latitude.toFixed(6));
        console.log("📍 Lon:", this.userLocation.longitude.toFixed(6));
        console.log("📏 Accuracy:", this.userLocation.accuracy, "meters");
        
        this.showMessage("Location obtained successfully!", 'success');
        this.updateLocationUI();
        
        resolve(this.userLocation);
    }

    handleError(error, resolve, reject) {
        this.permissionStatus = 'denied';
        
        console.error("❌ Location Error:", error.code, error.message);
        
        let errorMessage = "Unable to get your location. ";
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage += "Permission was denied. ";
                this.showMessage("Location permission denied. Using approximate location instead.", 'warning');
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage += "Location information is unavailable. ";
                break;
            case error.TIMEOUT:
                errorMessage += "The request to get location timed out. ";
                this.showMessage("Location request timed out. Trying again...", 'warning');
                break;
            default:
                errorMessage += "An unknown error occurred. ";
        }
        
        // Always fallback to IP-based location for college project
        const fallbackLocation = this.useFallbackLocation();
        resolve(fallbackLocation); // Resolve with fallback instead of rejecting
    }

    // IP-based fallback location (for college project demo)
    async useFallbackLocation() {
        console.log("Using IP-based fallback location...");
        
        try {
            // Try multiple free IP geolocation APIs
            const location = await this.getIPLocation();
            this.showMessage("Using approximate location based on your IP address.", 'info');
            return location;
        } catch (error) {
            console.log("IP location failed, using default location for project demo.");
            return this.getDefaultCollegeLocation();
        }
    }

    async getIPLocation() {
        // Try multiple free APIs (great for college projects)
        const apis = [
            'https://ipapi.co/json/',
            'https://ipinfo.io/json?token=demo', // Free tier available
            'https://freegeoip.app/json/'
        ];

        for (const api of apis) {
            try {
                const response = await fetch(api, { timeout: 5000 });
                if (!response.ok) continue;
                
                const data = await response.json();
                
                return {
                    latitude: parseFloat(data.latitude) || data.lat,
                    longitude: parseFloat(data.longitude) || data.lng || data.lon,
                    city: data.city,
                    region: data.region,
                    country: data.country_name || data.country,
                    source: 'ip-api',
                    accuracy: 50000 // IP-based accuracy is low (~50km)
                };
            } catch (error) {
                console.log(`API ${api} failed, trying next...`);
                continue;
            }
        }
        
        throw new Error("All IP APIs failed");
    }

    // Default location for college project (use your college coordinates)
    getDefaultCollegeLocation() {
        return {
            latitude: 12.9716, // Example: Bangalore
            longitude: 77.5946,
            city: "Bangalore",
            region: "Karnataka",
            country: "India",
            source: 'default-college',
            accuracy: 1000,
            isDefault: true
        };
    }

    // Get distance between two points (useful for college projects)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in km
        
        return distance;
    }

    toRad(degrees) {
        return degrees * (Math.PI/180);
    }

    // UI helper functions
    showMessage(message, type = 'info') {
        const messageDiv = document.getElementById('locationMessage') || this.createMessageElement();
        messageDiv.textContent = message;
        messageDiv.className = `location-message ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
        }, 5000);
    }

    createMessageElement() {
        const div = document.createElement('div');
        div.id = 'locationMessage';
        div.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
            transition: opacity 0.5s;
            max-width: 300px;
        `;
        document.body.appendChild(div);
        return div;
    }

    showLoadingState() {
        const button = document.getElementById('locationButton');
        if (button) {
            const originalText = button.textContent;
            button.textContent = "Getting location...";
            button.disabled = true;
            
            // Restore after 3 seconds if something goes wrong
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 3000);
        }
    }

    updateLocationUI() {
        if (!this.userLocation) return;
        
        // Update any location display elements
        const latElement = document.getElementById('latitude');
        const lonElement = document.getElementById('longitude');
        
        if (latElement) latElement.textContent = this.userLocation.latitude.toFixed(6);
        if (lonElement) lonElement.textContent = this.userLocation.longitude.toFixed(6);
        
        // Show on map if you have a map element
        this.showOnMap();
    }

    showOnMap() {
        // Basic map display - you can integrate with Leaflet or Google Maps
        const mapElement = document.getElementById('locationMap');
        if (mapElement && this.userLocation) {
            mapElement.innerHTML = `
                <div style="padding: 10px; background: #f0f0f0; border-radius: 5px;">
                    <strong>📍 Your Location</strong><br>
                    Latitude: ${this.userLocation.latitude.toFixed(6)}<br>
                    Longitude: ${this.userLocation.longitude.toFixed(6)}<br>
                    Accuracy: ${this.userLocation.accuracy ? this.userLocation.accuracy.toFixed(0) + ' meters' : 'Unknown'}
                    ${this.userLocation.source === 'default-college' ? '<br><small>(Default location for demo)</small>' : ''}
                </div>
            `;
        }
    }
}

// Initialize the service
const locationService = new LocationService();

// Enhanced button handler with better UX
document.getElementById("locationButton")?.addEventListener("click", async function() {
    // First, show explanation for college project
    const confirmed = confirm(
        "For our college project demonstration, we need your location to:\n\n" +
        "1. Show nearby points of interest\n" +
        "2. Calculate distances\n" +
        "3. Demonstrate geolocation features\n\n" +
        "Your data is not stored. Click OK to continue."
    );
    
    if (confirmed) {
        const location = await locationService.requestUserLocation({
            highAccuracy: false, // Set to true for more precise location
            timeout: 15000 // 15 seconds timeout
        });
        
        // Use the location in your project
        console.log("Location for project use:", location);
        
        // Example: Calculate distance from college
        const collegeLocation = locationService.getDefaultCollegeLocation();
        const distance = locationService.calculateDistance(
            location.latitude, location.longitude,
            collegeLocation.latitude, collegeLocation.longitude
        );
        
        console.log(`Distance from college: ${distance.toFixed(2)} km`);
    }
});

// Optional: Add CSS for message styles
const style = document.createElement('style');
style.textContent = `
    .location-message {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        color: #1565c0;
    }
    .location-message.success {
        background: #e8f5e9;
        border-left-color: #4caf50;
        color: #2e7d32;
    }
    .location-message.warning {
        background: #fff3e0;
        border-left-color: #ff9800;
        color: #ef6c00;
    }
    .location-message.error {
        background: #ffebee;
        border-left-color: #f44336;
        color: #c62828;
    }
`;
document.head.appendChild(style);
