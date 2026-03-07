# CLAUDE.MD - AI Assistant Guide for Snow Forecast App

## Project Overview

**Snow Forecast Dashboard** is a modern web application providing 14-day snow forecasts with interactive maps, alerts, and data visualizations. Built with vanilla JavaScript, it offers intelligent city search, geolocation, Leaflet.js maps, Chart.js visualizations, and customizable snow alerts.

- **Repository**: https://github.com/franz-boot/weatherapp
- **Type**: Client-side web application (SPA)
- **Languages**: Czech (default), German
- **License**: MIT
- **Live Demo**: Run on any HTTP server (no build required)

## Quick Start

```bash
# Start development server on port 3000
npx http-server -p 3000

# Or use Python
python -m http.server 3000

# Or use PHP
php -S localhost:3000
```

Visit: **http://localhost:3000**

## Project Structure

```
weatherapp/
├── index.html                 # Main HTML - UI structure and layout
├── src/
│   ├── css/
│   │   └── style.css         # All styles, animations, responsive design
│   └── js/
│       ├── app.js            # Main application logic (~700 lines)
│       └── forecast-utils.js # Utility functions for forecast data
├── README.md                  # User documentation (Czech)
├── CHANGELOG.md               # Version history
├── CLAUDE.MD                  # This file - AI assistant guide
└── package.json               # Metadata only (no dependencies)
```

## Architecture & Features

### Core Features

1. **Location Search & Selection**
   - Autocomplete city search with Open-Meteo Geocoding API
   - Geolocation support (requires HTTPS or localhost)
   - Interactive Leaflet.js map showing selected location
   - External map link for detailed view

2. **14-Day Snow Forecast**
   - Daily snow accumulation display
   - Temperature ranges (min/max)
   - Precipitation probability
   - Weather condition icons
   - Confidence scores (decreases with forecast distance)

3. **Data Visualization**
   - Interactive Chart.js bar chart for snow accumulation
   - Total snow summary statistics
   - Snow days counter
   - Maximum daily snowfall indicator

4. **Smart Alerts**
   - Customizable snow threshold alerts
   - Email notifications via EmailJS
   - Visual alert banners
   - Toggle on/off functionality

5. **Internationalization (i18n)**
   - Czech (default) and German languages
   - Runtime language switching
   - All UI text translatable

6. **Winter Theming**
   - Animated snow particles (Canvas API)
   - Mountain background graphics
   - Glassmorphism card effects
   - Responsive design for all devices

## Technical Stack

### External Dependencies (CDN)
```html
<!-- Data Visualization -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Email Service -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<!-- Interactive Maps -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Typography -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
```

### Browser APIs
- **Geolocation API** - User location detection
- **Fetch API** - HTTP requests to weather APIs
- **Canvas API** - Snow animation
- **Web Share API** - Native sharing (if available)
- **Clipboard API** - Copy forecast to clipboard

### External APIs
- **Open-Meteo Weather API** - Forecast data (no key required)
- **Open-Meteo Geocoding API** - City search and coordinates
- **EmailJS** - Optional email notifications

## Key Files & Components

### 1. index.html (~160 lines)

Main HTML structure with semantic elements:

**Search Card** (lines 41-63):
- City search input with autocomplete
- "My Location" button for geolocation
- Selected location display
- **NEW**: Interactive Leaflet map with external link

**Forecast Card** (lines 65-113):
- **NEW**: Forecast metadata section
- 14-day forecast display grid
- Chart.js visualization
- **NEW**: Enhanced snow statistics:
  - Total snow accumulation (14 days)
  - Snow days counter
  - Maximum daily snowfall
- Share functionality (native + copy)

**Alert Card** (lines 115-149):
- Toggle alerts on/off
- Snow threshold input
- Email notification form
- Alert banner display

**Accessibility Improvements**:
- Proper `<label for="">` associations
- ARIA labels on interactive elements
- Aria-hidden on decorative elements

### 2. src/js/app.js (~700 lines)

Main application logic:

**Global State:**
```javascript
let currentForecast = null;    // Weather forecast data
let currentLocation = null;    // Selected location {name, lat, lon, country}
let currentLang = 'cs';        // Active language (cs/de)
let snowChart = null;          // Chart.js instance
let locationMap = null;        // Leaflet map instance
```

**Core Functions:**

**Location & Search:**
- `searchCity()` - City search with API call
- `fetchCitySuggestions(query)` - Autocomplete suggestions
- `selectCity(city)` - Select from autocomplete results
- `useMyLocation()` - Geolocation detection
- `initLocationMap(lat, lon)` - **NEW**: Initialize Leaflet map
- `updateLocationMap(lat, lon, name)` - **NEW**: Update map marker

**Data Fetching:**
- `fetchForecast(lat, lon)` - Main Open-Meteo API call
- Returns: 14 days of snow, temperature, precipitation data

**Rendering:**
- `renderForecast(daily)` - Creates forecast cards
- `renderForecastMetadata()` - **NEW**: Displays forecast info
- `renderChart(daily)` - Chart.js visualization
- `updateSnowStatistics(daily)` - **NEW**: Calculates statistics
- `updateUI()` - Updates all i18n text

**Statistics Calculation:**
- `calculateTotalSnow(daily)` - Sum of 14-day snowfall
- `countSnowDays(daily)` - Days with snowfall > 0
- `getMaxDailySnow(daily)` - Maximum single-day snowfall

**Alerts:**
- `checkAlerts()` - Evaluates threshold, shows banner
- `sendEmailAlert()` - EmailJS integration
- `toggleAlerts()` - Enable/disable alerts

**i18n:**
- `setLanguage(lang)` - Changes active language
- `translations` object - CS/DE translations
- `updateUI()` - Applies translations to DOM

**Utilities:**
- `getWeatherIcon(code)` - Weather code to emoji
- `formatDate(dateStr)` - Date formatting
- `showToast(message)` - Toast notifications
- `nativeShare()` - Web Share API
- `copyToClipboard()` - Copy forecast text

**Animation:**
- `initSnow()` - Canvas setup
- `animateSnow()` - RequestAnimationFrame loop
- Snow particle system with physics

### 3. src/js/forecast-utils.js (~40 lines)

**NEW MODULE**: Utility functions for forecast data processing.

**Functions:**

```javascript
// Compute confidence score (0-100)
// Decreases by 5% per day, averaged with precipitation probability
ForecastUtils.computeConfidence(dayIndex, precipProb)

// Normalize daily weather data arrays to consistent length
// Handles missing data, different array lengths, and null values
ForecastUtils.normalizeDailyData(daily)
```

**Usage:**
```javascript
// Normalize API response
const normalized = ForecastUtils.normalizeDailyData(apiResponse.daily);

// Calculate confidence
const confidence = ForecastUtils.computeConfidence(3, 75); // Day 3, 75% precip
// Returns: Math.round((85 + 75) / 2) = 80
```

**Module Pattern:**
- Works in browser (global `ForecastUtils`) and Node.js (`module.exports`)
- Pure functions, no side effects
- Safe handling of invalid/missing data

### 4. src/css/style.css

**CSS Organization:**

1. **Reset & Base Styles**
   - CSS reset
   - Root variables (colors, spacing)
   - Typography (Inter font)

2. **Layout**
   - Winter background gradient
   - Mountain graphics (pure CSS)
   - Canvas for snow animation
   - Dashboard grid layout

3. **Components**
   - Cards with glassmorphism
   - Buttons (primary, secondary, small)
   - Input fields & search
   - Language switcher
   - Location map container (Leaflet)
   - Forecast cards grid
   - Chart container
   - **NEW**: Enhanced snow statistics layout
   - Alert banner
   - Toast notifications

4. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: 768px (tablet), 1200px (desktop)
   - Touch-friendly buttons
   - Adaptive chart sizing

5. **Animations**
   - Card hover effects
   - Button transitions
   - Toast slide-in
   - Loading spinner
   - Smooth scrolling

## Development Guide

### Adding New Features

#### 1. Add a New Language

**Step 1**: Extend translations object in `app.js`:
```javascript
const translations = {
    cs: { /* existing */ },
    de: { /* existing */ },
    en: {
        title: 'Snow Forecast',
        subtitle: '14-day forecast and alerts',
        searchLocation: 'Search Location',
        // ... add all translation keys
    }
};
```

**Step 2**: Add language button in `index.html`:
```html
<button class="lang-btn" onclick="setLanguage('en')">EN</button>
```

#### 2. Modify Weather Data Source

Location: `fetchForecast()` function in `app.js`

```javascript
async function fetchForecast(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&longitude=${lon}` +
        `&daily=snowfall_sum,snow_depth,temperature_2m_max,temperature_2m_min,` +
        `precipitation_probability_max,weathercode` +
        `&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
}
```

**Available Parameters**: See [Open-Meteo Docs](https://open-meteo.com/en/docs)

#### 3. Customize Map Appearance

Location: `initLocationMap()` in `app.js`

```javascript
function initLocationMap(lat, lon) {
    locationMap = L.map('locationMap').setView([lat, lon], 10);

    // Change tile layer (current: OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(locationMap);

    // Customize marker
    const marker = L.marker([lat, lon]).addTo(locationMap);
    marker.bindPopup('Selected Location').openPopup();
}
```

**Alternative Tile Providers**:
- **Satellite**: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
- **Terrain**: `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`
- **Dark Mode**: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`

#### 4. Add New Statistics

**Step 1**: Calculate statistic in `app.js`:
```javascript
function calculateAverageSnow(daily) {
    const total = daily.snowfall_sum.reduce((sum, val) => sum + val, 0);
    return (total / daily.snowfall_sum.length).toFixed(1);
}
```

**Step 2**: Display in `updateSnowStatistics()`:
```javascript
function updateSnowStatistics(daily) {
    // Existing statistics...

    // Add average
    const avgSnow = calculateAverageSnow(daily);
    document.getElementById('avgSnow').textContent = `${avgSnow} cm`;
}
```

**Step 3**: Add HTML element in `index.html`:
```html
<div class="total-snow-stat">
    <span class="stat-value" id="avgSnow">0 cm</span>
    <span class="stat-label" data-i18n="avgSnow">Průměr za den</span>
</div>
```

**Step 4**: Add translation:
```javascript
translations.cs.avgSnow = "Průměr za den";
translations.de.avgSnow = "Durchschnitt pro Tag";
```

### Common Modifications

#### Change Snow Threshold Default

`index.html` line 129:
```html
<input type="number" id="threshold" value="1" min="0" step="0.5">
```

#### Adjust Forecast Days (from 14 to 7)

`app.js` in `renderForecast()`:
```javascript
for (let i = 0; i < Math.min(7, daily.time.length); i++) {
    // ... forecast card generation
}
```

#### Modify Chart Colors

`app.js` in `renderChart()`:
```javascript
backgroundColor: 'rgba(59, 130, 246, 0.8)',  // Blue
borderColor: 'rgb(59, 130, 246)',
```

#### Email Configuration

`app.js`:
```javascript
const EMAIL_CONFIG = {
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID'
};
```

Get keys from: https://www.emailjs.com/

## API Reference

### Open-Meteo Weather API

**Endpoint**: `https://api.open-meteo.com/v1/forecast`

**Parameters**:
- `latitude` (required): Location latitude
- `longitude` (required): Location longitude
- `daily` (required): Comma-separated metrics
  - `snowfall_sum`: Daily snow accumulation (cm)
  - `snow_depth`: Total snow depth (cm)
  - `temperature_2m_max`: Max temperature (°C)
  - `temperature_2m_min`: Min temperature (°C)
  - `precipitation_probability_max`: Precipitation chance (%)
  - `weathercode`: WMO weather code
- `timezone`: Auto or IANA timezone

**Response Structure**:
```json
{
  "daily": {
    "time": ["2026-03-07", "2026-03-08", ...],
    "snowfall_sum": [5.2, 2.1, 0, ...],
    "temperature_2m_max": [-2, -5, -3, ...],
    "temperature_2m_min": [-8, -10, -9, ...],
    "precipitation_probability_max": [80, 60, 30, ...],
    "weathercode": [71, 73, 0, ...]
  }
}
```

**Weather Codes**:
- 0: Clear sky ☀️
- 71-77: Snow 🌨️
- 61-67: Rain 🌧️
- 80-86: Showers 🌦️
- 95-99: Thunderstorm ⛈️

### Open-Meteo Geocoding API

**Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`

**Parameters**:
- `name`: City name (query)
- `count`: Results limit (default: 10)
- `language`: cs/de/en

**Response**:
```json
{
  "results": [
    {
      "name": "Prague",
      "latitude": 50.0880,
      "longitude": 14.4208,
      "country": "Czechia",
      "admin1": "Prague"
    }
  ]
}
```

## Testing & Debugging

### Manual Testing Checklist

- [ ] **Search**: City autocomplete works, suggests relevant cities
- [ ] **Geolocation**: Detects user location (requires permission)
- [ ] **Map**: Leaflet map renders, marker appears at location
- [ ] **Forecast**: 14 cards display with correct data
- [ ] **Chart**: Bar chart renders with snow data
- [ ] **Statistics**: Total snow, snow days, max snow calculated correctly
- [ ] **Alerts**: Threshold triggers alert banner
- [ ] **Email**: Email notification sends (if configured)
- [ ] **i18n**: Language switching updates all text
- [ ] **Sharing**: Native share (mobile) and copy work
- [ ] **Responsive**: Works on mobile, tablet, desktop
- [ ] **Animation**: Snow particles animate smoothly

### Debug Console Commands

Open browser DevTools (F12):

```javascript
// View current state
console.log('Forecast:', currentForecast);
console.log('Location:', currentLocation);
console.log('Language:', currentLang);

// Test forecast data normalization
const testData = {
    time: ['2026-03-07', '2026-03-08'],
    snowfall_sum: [5.2]  // Missing one value
};
console.log(ForecastUtils.normalizeDailyData(testData));

// Check Leaflet map
console.log('Map:', locationMap);
if (locationMap) {
    console.log('Center:', locationMap.getCenter());
    console.log('Zoom:', locationMap.getZoom());
}

// Test confidence calculation
for (let i = 0; i < 14; i++) {
    console.log(`Day ${i}: ${ForecastUtils.computeConfidence(i, 70)}% confidence`);
}
```

### Common Issues & Solutions

#### 1. Forecast Not Loading

**Symptoms**: Loading spinner forever, no forecast cards

**Check**:
```javascript
// In browser console
fetch('https://api.open-meteo.com/v1/forecast?latitude=50&longitude=14&daily=snowfall_sum&timezone=auto')
    .then(r => r.json())
    .then(console.log);
```

**Solutions**:
- Verify Open-Meteo API is accessible
- Check coordinates are valid (lat: -90 to 90, lon: -180 to 180)
- Look for CORS errors (API should allow all origins)
- Check network tab for API response

#### 2. Geolocation Fails

**Symptoms**: "My Location" doesn't work, permission denied

**Causes**:
- Not using HTTPS (required except localhost)
- User denied permission
- Browser doesn't support Geolocation API

**Solutions**:
- Use HTTPS or localhost for development
- Check browser console for specific error
- Test: `navigator.geolocation.getCurrentPosition(console.log, console.error)`

#### 3. Map Not Rendering

**Symptoms**: Empty map container, Leaflet errors

**Check**:
- Leaflet CSS loaded: `document.querySelector('link[href*="leaflet.css"]')`
- Leaflet JS loaded: `typeof L !== 'undefined'`
- Container has height: `#locationMap` must have explicit height in CSS

**Solutions**:
- Ensure Leaflet CSS loads before JS
- Check container has `height: 200px` in CSS
- Call `locationMap.invalidateSize()` after showing hidden map

#### 4. Chart Not Showing

**Symptoms**: No chart, Chart.js errors

**Check**:
- Chart.js loaded: `typeof Chart !== 'undefined'`
- Canvas element exists: `document.getElementById('snowChart')`
- Data is valid: `console.log(currentForecast.daily)`

**Solutions**:
- Verify Chart.js CDN loads
- Destroy old chart before creating new: `if (snowChart) snowChart.destroy();`
- Check data arrays have same length

#### 5. Email Not Sending

**Symptoms**: Email button does nothing, EmailJS errors

**Check**:
- EmailJS initialized: `emailjs.init('YOUR_PUBLIC_KEY')`
- Configuration complete: `EMAIL_CONFIG` object filled
- Email address valid: Proper email format

**Solutions**:
- Get EmailJS account and keys
- Check browser console for specific error
- Verify EmailJS service status
- Falls back to mailto: link if not configured

#### 6. Translations Missing

**Symptoms**: UI shows key names instead of text (e.g., "searchLocation")

**Solutions**:
- Verify all elements have `data-i18n` attribute
- Check `translations[currentLang]` has the key
- Call `updateUI()` after language change
- Inspect: `console.log(translations[currentLang])`

#### 7. Snow Animation Laggy

**Symptoms**: Choppy animation, low FPS on mobile

**Solutions**:
- Reduce particle count in `initSnow()`
- Lower canvas resolution
- Use `will-change: transform` on canvas
- Disable animation on low-end devices:
  ```javascript
  if (navigator.hardwareConcurrency < 4) {
      // Skip initSnow()
  }
  ```

## Performance Optimization

### Current Bottlenecks

1. **Chart.js Bundle**: ~200KB from CDN
2. **Canvas Animation**: CPU-intensive on mobile
3. **Autocomplete**: No debouncing on input
4. **No Caching**: Repeat API calls for same location
5. **No Code Splitting**: All JS loads at once

### Optimization Opportunities

#### 1. Debounce City Search

Add to `app.js`:
```javascript
let searchTimeout;
document.getElementById('cityInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchCitySuggestions(e.target.value);
    }, 300);  // Wait 300ms after typing stops
});
```

#### 2. Cache Forecast Data

```javascript
const forecastCache = new Map();

async function fetchForecast(lat, lon) {
    const key = `${lat},${lon}`;

    if (forecastCache.has(key)) {
        const cached = forecastCache.get(key);
        if (Date.now() - cached.timestamp < 30 * 60 * 1000) {  // 30 min
            return cached.data;
        }
    }

    const data = await fetch(/* ... */).then(r => r.json());
    forecastCache.set(key, { data, timestamp: Date.now() });
    return data;
}
```

#### 3. Lazy Load Chart.js

```javascript
let chartJsLoaded = false;

async function loadChartJs() {
    if (chartJsLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    await new Promise(resolve => {
        script.onload = resolve;
        document.head.appendChild(script);
    });
    chartJsLoaded = true;
}

// Load only when showing forecast
async function renderChart(daily) {
    await loadChartJs();
    // ... create chart
}
```

#### 4. Optimize Snow Animation

```javascript
// Reduce particles on mobile
const particleCount = window.innerWidth < 768 ? 50 : 100;

// Use offscreen canvas for better performance
const offscreenCanvas = new OffscreenCanvas(width, height);
const offscreenCtx = offscreenCanvas.getContext('2d');

// Lower FPS on low-end devices
const targetFps = navigator.hardwareConcurrency >= 4 ? 60 : 30;
const frameDelay = 1000 / targetFps;
```

#### 5. Service Worker for Offline Support

Create `sw.js`:
```javascript
const CACHE_NAME = 'snow-forecast-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/src/css/style.css',
    '/src/js/app.js',
    '/src/js/forecast-utils.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

Register in `app.js`:
```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
```

## Security Considerations

### Current Security Status

✅ **Safe**:
- No sensitive data stored client-side
- EmailJS public key safe to expose
- No authentication required
- API keys not needed for Open-Meteo
- CORS handled by external APIs

⚠️ **Consider**:
- Input sanitization for city search (XSS prevention)
- Rate limiting for API calls (avoid abuse)
- CSP headers for production deployment

### Recommended CSP Header

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;
    img-src 'self' data: https://*.tile.openstreetmap.org;
    connect-src https://api.open-meteo.com https://geocoding-api.open-meteo.com;
    font-src https://fonts.gstatic.com;
">
```

## Deployment

### GitHub Pages

```bash
# Push to gh-pages branch
git checkout -b gh-pages
git push origin gh-pages
```

Enable in Settings → Pages → Source: `gh-pages` branch

### Netlify

1. Connect GitHub repository
2. Build command: (leave empty)
3. Publish directory: `/`

### Vercel

```bash
vercel --prod
```

### Self-Hosted

```bash
# Copy files to web server
scp -r * user@server:/var/www/html/snow-forecast/

# Configure nginx
server {
    listen 80;
    server_name snow.example.com;
    root /var/www/html/snow-forecast;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Future Enhancements

Planned features (from README):

- [ ] **PWA**: Add manifest.json, service worker
- [ ] **Offline Mode**: Cache forecasts, work without internet
- [ ] **Favorites**: Save favorite locations (localStorage)
- [ ] **Push Notifications**: Browser push for snow alerts
- [ ] **Themes**: Light/dark mode toggle
- [ ] **Export**: CSV/PDF export of forecast data
- [ ] **Historical Data**: Past snow data charts
- [ ] **Comparison**: Compare multiple locations side-by-side
- [ ] **More APIs**: Weather.com, AccuWeather integration
- [ ] **Snow Conditions**: Ski resort conditions, avalanche warnings

## Code Style & Conventions

### JavaScript
- Vanilla JS, ES6+ features
- No transpilation or bundling
- Global functions for onclick handlers
- Async/await for API calls
- Template literals for HTML generation
- Descriptive names (English/Czech mix)

### CSS
- Component-based structure
- Mobile-first responsive design
- CSS custom properties for theming
- BEM-like naming (not strict)
- Avoid utility classes

### HTML
- Semantic HTML5 elements
- `data-i18n` for translatable text
- `data-i18n-placeholder` for input placeholders
- Accessible labels and ARIA attributes
- Inline onclick for simplicity

### Git Workflow
- **Branch naming**: Must start with `claude/` and end with session ID
- **Commits**: Conventional Commits style preferred
- **Push**: Always use `git push -u origin <branch-name>`
- **Retries**: Up to 4 retries with exponential backoff on network errors

## Resources

### Documentation
- **Open-Meteo**: https://open-meteo.com/en/docs
- **Chart.js**: https://www.chartjs.org/docs/
- **Leaflet.js**: https://leafletjs.com/reference.html
- **EmailJS**: https://www.emailjs.com/docs/

### Repository
- **GitHub**: https://github.com/franz-boot/weatherapp
- **Issues**: https://github.com/franz-boot/weatherapp/issues
- **Pull Requests**: Use GitHub PRs for contributions

### Inspiration
- **WMO Weather Codes**: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM

---

**Last Updated**: 2026-03-07
**Version**: 2.0 (with Leaflet maps & forecast-utils.js)
**For**: AI Assistants (Claude Code, etc.)
**Purpose**: Comprehensive codebase understanding and development guidance
