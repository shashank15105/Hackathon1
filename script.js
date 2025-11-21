// --- Dark Mode Toggle Functionality ---

const themeToggleDashboard = document.getElementById('themeToggleDashboard');
const themeIconDashboard = document.getElementById('themeIconDashboard');
const themeTextDashboard = document.getElementById('themeTextDashboard');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to system preference
const isDarkMode = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

/**
 * Updates the text and icon of the Dark Mode toggle button.
 * @param {HTMLElement} iconElement - The Material Symbols icon element.
 * @param {HTMLElement} textElement - The text element displaying the mode.
 * @param {boolean} isDark - True if the theme is currently dark.
 */
function updateThemeToggle(iconElement, textElement, isDark) {
    if (isDark) {
        iconElement.textContent = 'light_mode';
        textElement.textContent = 'Toggle Light Mode';
    } else {
        iconElement.textContent = 'dark_mode';
        textElement.textContent = 'Toggle Dark Mode';
    }
}

// Apply initial theme based on preference/system
if (isDarkMode) {
    htmlElement.classList.add('dark');
} else {
    htmlElement.classList.remove('dark');
}

// Initial setup for the button based on current theme state
updateThemeToggle(themeIconDashboard, themeTextDashboard, htmlElement.classList.contains('dark'));


// Event listener for the toggle button
themeToggleDashboard.addEventListener('click', () => {
    const isCurrentlyDark = htmlElement.classList.contains('dark');
    
    if (isCurrentlyDark) {
        // Switch to Light Mode
        htmlElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        // Switch to Dark Mode
        htmlElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
    
    // Update button display
    updateThemeToggle(themeIconDashboard, themeTextDashboard, !isCurrentlyDark);
});


// ------------------------------------
// --- Weather Variables and Functions ---
// ------------------------------------

// Constants for Weather API (using the key provided by the user)
const WEATHER_API_KEY = '36421c0e4d02fd00584284434afe866a';
const CITY_NAME = 'Bengaluru';
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Maps OpenWeatherMap icon code to Material Symbols icon name.
 * @param {string} iconCode 
 * @returns {string} Material Symbols icon name
 */
function getWeatherIconName(iconCode) {
    // Simplified mapping for common weather types
    const mapping = {
        '01d': 'clear_day', '01n': 'clear_night',
        '02d': 'partly_cloudy_day', '02n': 'partly_cloudy_night',
        '03d': 'cloudy', '03n': 'cloudy',
        '04d': 'broken_cloudy', '04n': 'broken_cloudy',
        '09d': 'rainy', '09n': 'rainy',
        '10d': 'rainy_light', '10n': 'rainy_night',
        '11d': 'thunderstorm', '11n': 'thunderstorm',
        '13d': 'ac_unit', '13n': 'ac_unit', // Snow/Winter
        '50d': 'foggy', '50n': 'foggy',
    };
    return mapping[iconCode] || 'thermostat'; // Default icon
}

/**
 * Updates the HTML elements with current weather data.
 * @param {Object} data - Weather API response object.
 */
function displayweather(data) {
    if (!data || data.cod !== 200) {
        console.error("Weather data failed to load or is invalid.", data);
        document.getElementById('weather-city').textContent = 'Data unavailable';
        document.getElementById('weather-temp').textContent = '--°C';
        return;
    }

    const temp = Math.round(data.main.temp);
    // Capitalize first letter of each word in the description
    const desc = data.weather[0].description.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const iconCode = data.weather[0].icon;

    document.getElementById('weather-temp').textContent = `${temp}°C`;
    document.getElementById('weather-city').textContent = data.name;
    document.getElementById('weather-desc').textContent = desc;
    document.getElementById('weather-icon').textContent = getWeatherIconName(iconCode);
}

/**
 * Placeholder for fetching weather forecast (as requested by user's function signature).
 * @param {string} city - City name for the forecast.
 */
function forecastweather(city) {
    // This is a placeholder as the user only provided the function signature for context.
    // The actual forecast logic would go here.
    console.log(`Forecast function called for ${city}.`);
}

/**
 * Fetches the current weather details for Bengaluru. (Provided by user)
 */
function fetchweather() {
    const currentweatherURL = `${BASE_WEATHER_URL}/weather?q=${CITY_NAME}&appid=${WEATHER_API_KEY}&units=metric`;
    
    // The fetch function provided by the user is used here.
    fetch(currentweatherURL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayweather(data);
        forecastweather(CITY_NAME);
    })
    .catch(error => {
        console.error("ERROR fetching weather: ", error);
        document.getElementById('weather-city').textContent = 'API Error';
        document.getElementById('weather-temp').textContent = '--°C';
    });
}

// Call the function on page load to initialize weather data
fetchweather();