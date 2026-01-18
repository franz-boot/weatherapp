# CLAUDE.MD - AI Assistant Guide for Snow Forecast App

## Project Overview

**Snow Forecast App** is a modern web application for tracking 14-day snow forecasts with alerts and visualizations. Built with vanilla JavaScript, it provides intelligent city search, geolocation, interactive charts, and customizable snow alerts.

- **Repository**: https://github.com/franz-boot/weatherapp
- **Type**: Client-side web application
- **Languages**: Czech (default), German
- **License**: MIT

## Quick Facts

- **No build process required** - Pure HTML/CSS/JS application
- **No dependencies to install** - Uses CDN for external libraries
- **Entry point**: `index.html`
- **Main logic**: `src/js/app.js` (~700 lines)
- **Styles**: `src/css/style.css` (single file, all styles)
- **Branch naming**: Must start with `claude/` and end with session ID

## Project Structure

```
weatherapp/
├── index.html              # Main HTML - UI structure and layout
├── src/
│   ├── css/
│   │   └── style.css      # All styles, animations, responsive design
│   └── js/
│       └── app.js         # Complete application logic
├── README.md              # User documentation (Czech)
├── CHANGELOG.md           # Version history
├── CLAUDE.MD              # This file - AI assistant guide
└── package.json           # Metadata and scripts (no deps)
```

## Architecture

### Single Page Application Flow

1. **User Interface** (index.html)
   - Search card with autocomplete
   - Forecast display with 14-day cards
   - Interactive Chart.js visualization
   - Alert configuration panel
   - Language switcher (CS/DE)
   - Animated snow canvas background

2. **Application Logic** (app.js)
   - Global state management (no framework)
   - API calls to Open-Meteo
   - UI rendering and updates
   - i18n translation system
   - Email notifications via EmailJS
   - Canvas animation for snow effect

3. **External APIs**
   - Open-Meteo Weather API (forecast data)
   - Open-Meteo Geocoding API (city search)
   - EmailJS (optional email alerts)

## Key Components & Functions

### Core State Variables (app.js)

```javascript
let currentForecast = null;    // Current weather forecast data
let currentLocation = null;    // Selected location object
let currentLang = 'cs';        // Active language
let snowChart = null;          // Chart.js instance
```

### Critical Functions

**Location & Search:**
- `searchCity()` - Handles city search, triggers autocomplete
- `selectCity(city)` - User selects from autocomplete results
- `useMyLocation()` - Geolocation API integration
- `fetchForecast(lat, lon)` - Main API call to Open-Meteo

**Rendering:**
- `renderForecast(daily)` - Creates 14-day forecast cards
- `renderChart(daily)` - Renders Chart.js visualization
- `updateUI()` - Updates all UI elements with translations

**Alerts:**
- `checkAlerts()` - Evaluates snow threshold and shows alerts
- `sendEmailAlert()` - Sends email via EmailJS
- `toggleAlerts()` - Enables/disables alert system

**i18n:**
- `setLanguage(lang)` - Changes active language, updates all text
- `translations` object - Contains CS and DE translations

**Animation:**
- `initSnow()` - Sets up canvas snow animation
- `animateSnow()` - RAF loop for snow particles

## Technologies & Dependencies

### External Libraries (CDN)
- **Chart.js** - Data visualization for snow accumulation
- **EmailJS Browser SDK** - Email notification service
- **Google Fonts** - Inter font family

### Browser APIs Used
- Geolocation API (requires HTTPS or localhost)
- Fetch API (for HTTP requests)
- Canvas API (for snow animation)
- LocalStorage (for preferences - if implemented)

### CSS Features
- CSS Grid for dashboard layout
- Glassmorphism effects (backdrop-filter)
- CSS animations and transitions
- Responsive breakpoints: 768px, 1200px

## Common Development Tasks

### Adding a New Language

1. Extend `translations` object in `app.js`:
```javascript
const translations = {
    cs: { /* existing */ },
    de: { /* existing */ },
    en: {  // Add new language
        title: 'Snow Forecast',
        subtitle: '14-day forecast and alerts',
        // ... add all translation keys
    }
};
```

2. Add language button in `index.html`:
```html
<button class="lang-btn" onclick="setLanguage('en')">EN</button>
```

### Modifying Weather Data Sources

- Forecast API call: `fetchForecast()` function around line ~300
- API endpoint: `https://api.open-meteo.com/v1/forecast`
- Parameters: latitude, longitude, daily metrics, timezone
- Response structure: `daily.time[]`, `daily.snowfall_sum[]`, `daily.snow_depth[]`

### Styling Changes

All styles in `src/css/style.css`, organized as:
1. CSS Reset & Base
2. Winter background & mountains
3. Language switcher
4. Dashboard & grid layout
5. Cards & components
6. Buttons & inputs
7. Forecast display
8. Chart container
9. Alerts
10. Responsive media queries

### Configuring Email Alerts

Update `EMAIL_CONFIG` in `app.js`:
```javascript
const EMAIL_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID'
};
```

If not configured, app falls back to `mailto:` links.

## Important Notes & Gotchas

### API Considerations
- Open-Meteo is free and requires no API key
- Rate limiting may apply for high traffic
- Timezone is auto-detected from lat/lon
- Snow data may be null for non-winter periods

### Browser Compatibility
- Geolocation requires HTTPS (except localhost)
- Canvas API needed for snow animation
- Backdrop-filter (glassmorphism) may not work in older browsers
- Chart.js requires modern JavaScript support

### Responsive Design
- Mobile-first approach
- Touch-friendly buttons and inputs
- Charts are responsive via Chart.js config
- Snow animation density adjusts to screen size

### State Management
- No persistent storage implemented (consider localStorage)
- All state resets on page reload
- Selected location and forecast data held in memory

### Translation System
- All UI text must have `data-i18n` attribute
- Placeholders use `data-i18n-placeholder`
- Missing translations fall back to key name
- Language preference not persisted

## Testing & Debugging

### Manual Testing Checklist
- [ ] City search autocomplete works
- [ ] Geolocation permission and detection
- [ ] Forecast loads and displays 14 cards
- [ ] Chart renders correctly
- [ ] Language switching updates all text
- [ ] Alert threshold triggers correctly
- [ ] Email notification (if configured)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Snow animation performs smoothly

### Debug Tools

Open browser console (F12) and check:
```javascript
console.log(currentForecast);  // View forecast data
console.log(currentLocation);  // View selected location
console.log(currentLang);      // View active language
```

### Common Issues

**Forecast not loading:**
- Check network tab for API errors
- Verify Open-Meteo API is accessible
- Check coordinates are valid

**Geolocation fails:**
- User must grant permission
- Requires HTTPS or localhost
- Check browser geolocation support

**Charts not rendering:**
- Verify Chart.js CDN loads
- Check for JavaScript errors
- Ensure canvas element exists

**Email not sending:**
- Verify EmailJS configuration
- Check browser console for errors
- Confirm EmailJS service is active

## Development Workflow

### Local Development
```bash
# Option 1: Python HTTP server
python -m http.server 8000

# Option 2: Node.js http-server
npx http-server -p 8000

# Option 3: PHP built-in server
php -S localhost:8000
```

Then visit: `http://localhost:8000`

### Git Workflow
- **Development branch**: Must start with `claude/` prefix
- **Commit messages**: Use conventional commits style
- **Push**: Always use `git push -u origin <branch-name>`
- **Network retries**: Up to 4 retries with exponential backoff

### Making Changes
1. Read relevant files first (never modify without reading)
2. Make focused, minimal changes
3. Test manually in browser
4. Commit with descriptive message
5. Push to correct branch

## Performance Considerations

### Optimization Opportunities
- Debounce city search autocomplete
- Lazy load Chart.js if forecast not shown
- Optimize snow animation particle count
- Cache forecast data for same location
- Compress snow animation calculations

### Current Bottlenecks
- Canvas animation on low-end devices
- Chart.js bundle size (~200KB from CDN)
- Multiple API calls for autocomplete
- No service worker for offline support

## Future Enhancements (from README)

Planned features:
- [ ] Offline support (Service Worker)
- [ ] PWA capabilities
- [ ] LocalStorage for favorite locations
- [ ] Push notifications
- [ ] Light/dark themes
- [ ] CSV/PDF export
- [ ] Historical snow data
- [ ] Multi-location comparison
- [ ] Additional weather API integrations

## Code Style & Conventions

### JavaScript
- Vanilla JS, no transpilation
- Global functions for event handlers
- Async/await for API calls
- Template literals for HTML generation
- Descriptive variable names in English/Czech mix

### CSS
- BEM-like naming (not strict)
- Mobile-first responsive design
- CSS custom properties for theming
- Utility classes avoided (component-based)

### HTML
- Semantic elements
- `data-i18n` attributes for translations
- `onclick` handlers for simplicity
- Accessible form labels and ARIA where needed

## Security Notes

- No sensitive data stored client-side
- EmailJS public key is safe to expose
- No user authentication required
- API keys not needed for Open-Meteo
- CORS handled by external APIs

## Resources

### Documentation
- Open-Meteo API: https://open-meteo.com/
- Chart.js: https://www.chartjs.org/
- EmailJS: https://www.emailjs.com/docs/

### Repository
- GitHub: https://github.com/franz-boot/weatherapp
- Issues: Use GitHub Issues for bug reports

---

**Last Updated**: 2026-01-18
**For**: AI Assistants (Claude, etc.)
**Purpose**: Comprehensive codebase understanding and development guidance
