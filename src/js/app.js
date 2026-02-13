// ========================================
// TRANSLATIONS
// ========================================
const translations = {
    cs: {
        title: 'Předpověď sněhu',
        subtitle: '14denní předpověď a upozornění',
        searchLocation: 'Vyhledat místo',
        searchPlaceholder: 'Zadejte název města...',
        search: 'Hledat',
        myLocation: 'Moje poloha',
        selectedLocation: 'Vybrané místo',
        locationMap: 'Lokalita na mapě',
        openMap: 'Otevřít mapu',
        forecast14days: '14denní předpověď',
        loading: 'Načítání',
        snowAccumulation: 'Akumulace sněhu',
        total14days: 'Celkem za 14 dní',
        share: 'Sdílet',
        copy: 'Kopírovat',
        snowAlerts: 'Upozornění na sníh',
        enableAlerts: 'Povolit upozornění',
        alertThreshold: 'Upozornit když sníh přesáhne:',
        emailNotifications: 'E-mailová upozornění',
        emailPlaceholder: 'vas@email.cz',
        send: 'Odeslat',
        snowAlert: 'Upozornění na sníh!',
        today: 'Dnes',
        tomorrow: 'Zítra',
        week2: 'Týden 2 - nižší spolehlivost',
        noSnow: 'V příštích 14 dnech se sníh neočekává',
        cityNotFound: 'Město nenalezeno. Zkuste jiný název.',
        fetchError: 'Nepodařilo se načíst předpověď. Zkuste to znovu.',
        locationError: 'Nelze získat vaši polohu.',
        copied: 'Zkopírováno do schránky!',
        copyFailed: 'Kopírování selhalo',
        emailSent: 'E-mail úspěšně odeslán!',
        emailFailed: 'Odeslání se nezdařilo.',
        enterEmail: 'Zadejte e-mailovou adresu.',
        searchFirst: 'Nejprve vyhledejte místo.',
        snow: 'sníh',
        confidence: 'spolehlivost',
        dailySnow: 'Denní sníh (cm)',
        cumulative: 'Kumulativní (cm)',
        confidencePercent: 'Spolehlivost (%)',
        days: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
        months: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro']
    },
    de: {
        title: 'Schneevorhersage',
        subtitle: '14-Tage-Vorhersage und Warnungen',
        searchLocation: 'Ort suchen',
        searchPlaceholder: 'Stadtnamen eingeben...',
        search: 'Suchen',
        myLocation: 'Mein Standort',
        selectedLocation: 'Ausgewählter Ort',
        locationMap: 'Standort auf der Karte',
        openMap: 'Karte öffnen',
        forecast14days: '14-Tage-Vorhersage',
        loading: 'Laden',
        snowAccumulation: 'Schneeakkumulation',
        total14days: 'Gesamt 14 Tage',
        share: 'Teilen',
        copy: 'Kopieren',
        snowAlerts: 'Schneewarnungen',
        enableAlerts: 'Warnungen aktivieren',
        alertThreshold: 'Warnen wenn Schnee überschreitet:',
        emailNotifications: 'E-Mail-Benachrichtigungen',
        emailPlaceholder: 'ihre@email.de',
        send: 'Senden',
        snowAlert: 'Schneewarnung!',
        today: 'Heute',
        tomorrow: 'Morgen',
        week2: 'Woche 2 - geringere Zuverlässigkeit',
        noSnow: 'In den nächsten 14 Tagen wird kein Schnee erwartet',
        cityNotFound: 'Stadt nicht gefunden. Versuchen Sie einen anderen Namen.',
        fetchError: 'Vorhersage konnte nicht geladen werden. Versuchen Sie es erneut.',
        locationError: 'Standort konnte nicht ermittelt werden.',
        copied: 'In die Zwischenablage kopiert!',
        copyFailed: 'Kopieren fehlgeschlagen',
        emailSent: 'E-Mail erfolgreich gesendet!',
        emailFailed: 'Senden fehlgeschlagen.',
        enterEmail: 'Bitte E-Mail-Adresse eingeben.',
        searchFirst: 'Bitte zuerst einen Ort suchen.',
        snow: 'Schnee',
        confidence: 'Zuverlässigkeit',
        dailySnow: 'Täglicher Schnee (cm)',
        cumulative: 'Kumulativ (cm)',
        confidencePercent: 'Zuverlässigkeit (%)',
        days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        months: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    }
};

let currentLang = 'cs';
let currentForecast = null;
let currentLocation = null;
let snowChart = null;
let autocompleteTimeout = null;
let locationMap = null;
let locationMarker = null;

// ========================================
// EMAIL CONFIG
// ========================================
const EMAIL_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID'
};

if (EMAIL_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAIL_CONFIG.publicKey);
}

// ========================================
// LANGUAGE
// ========================================
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === lang.toUpperCase());
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    if (currentForecast) {
        renderForecast(currentForecast);
        renderChart(currentForecast);
    }
}

function t(key) {
    return translations[currentLang][key] || key;
}

function initLocationMap() {
    if (locationMap || typeof L === 'undefined') return;

    locationMap = L.map('locationMap', {
        zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(locationMap);
}

function updateLocationMap(lat, lon, name) {
    const mapSection = document.getElementById('locationMapSection');
    const mapLink = document.getElementById('locationMapLink');
    if (!mapSection || !mapLink) return;

    initLocationMap();
    if (!locationMap) return;

    mapSection.classList.remove('hidden');

    if (!locationMarker) {
        locationMarker = L.marker([lat, lon]).addTo(locationMap);
    } else {
        locationMarker.setLatLng([lat, lon]);
    }

    if (name) {
        locationMarker.bindPopup(name);
    }

    locationMap.setView([lat, lon], 10);
    mapLink.href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=10/${lat}/${lon}`;

    requestAnimationFrame(() => locationMap.invalidateSize());
}

function normalizeDailyData(daily) {
    const time = Array.isArray(daily?.time) ? daily.time : [];
    const length = time.length;

    const toSizedArray = (values, fallback = 0) => {
        if (Array.isArray(values)) {
            if (values.length >= length) return values.slice(0, length);
            return values.concat(Array.from({ length: length - values.length }, () => fallback));
        }
        return Array.from({ length }, () => fallback);
    };

    return {
        time,
        snowfall_sum: toSizedArray(daily?.snowfall_sum, 0),
        precipitation_probability_max: toSizedArray(daily?.precipitation_probability_max, 0),
        temperature_2m_max: toSizedArray(daily?.temperature_2m_max, 0),
        temperature_2m_min: toSizedArray(daily?.temperature_2m_min, 0),
        weathercode: toSizedArray(Array.isArray(daily?.weather_code) ? daily.weather_code : daily?.weathercode, 0)
    };
}

// ========================================
// REALISTIC SNOW ANIMATION
// ========================================
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

// Configuration for 3 depth layers
const snowConfig = {
    layers: [
        { count: 50, sizeMin: 5, sizeMax: 10, speedMin: 0.6, speedMax: 1.2, opacity: 0.95 },  // Close/large
        { count: 100, sizeMin: 2.5, sizeMax: 5, speedMin: 1, speedMax: 2, opacity: 0.7 },     // Medium
        { count: 180, sizeMin: 1, sizeMax: 2.5, speedMin: 1.5, speedMax: 3, opacity: 0.4 }    // Far/small
    ]
};

let snowLayers = [];
let wind = 0;
let targetWind = 0;
let time = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Draw crystal snowflake
function drawCrystal(x, y, size, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = 'white';
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, size * 0.12);

    for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);

        // Main arm
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -size);
        ctx.stroke();

        // Branches
        const b1 = size * 0.55, b2 = size * 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -b1);
        ctx.lineTo(-size * 0.25, -b1 - size * 0.2);
        ctx.moveTo(0, -b1);
        ctx.lineTo(size * 0.25, -b1 - size * 0.2);
        ctx.moveTo(0, -b2);
        ctx.lineTo(-size * 0.15, -b2 - size * 0.12);
        ctx.moveTo(0, -b2);
        ctx.lineTo(size * 0.15, -b2 - size * 0.12);
        ctx.stroke();

        ctx.restore();
    }
    ctx.restore();
}

// Draw simple star
function drawStar(x, y, size, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = Math.max(0.8, size * 0.15);
    ctx.lineCap = 'round';

    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -size);
        ctx.stroke();
        ctx.rotate(Math.PI / 3);
    }
    ctx.restore();
}

// Draw soft dot with glow
function drawDot(x, y, size, opacity) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

function createFlake(layer, index) {
    const cfg = snowConfig.layers[index];
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
        speed: cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin),
        opacity: cfg.opacity * (0.7 + Math.random() * 0.3),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.3 + Math.random() * 0.4,
        wobble: 0.5 + Math.random() * 1
    };
}

function createSnowLayers() {
    snowLayers = [];
    const scale = Math.min(1.5, canvas.width / 1200);

    snowConfig.layers.forEach((cfg, i) => {
        const particles = [];
        const count = Math.max(20, Math.floor(cfg.count * scale));
        for (let j = 0; j < count; j++) {
            particles.push(createFlake(cfg, i));
        }
        snowLayers.push(particles);
    });
}

function animateSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.016;

    // Evolve wind naturally
    if (Math.random() < 0.003) targetWind = (Math.random() - 0.5) * 1.5;
    wind += (targetWind - wind) * 0.008;

    // Draw back to front
    for (let i = snowLayers.length - 1; i >= 0; i--) {
        const layer = snowLayers[i];
        const windFactor = 1 - i * 0.35;
        const swayAmp = [1.8, 1.2, 0.6][i];

        layer.forEach((f, idx) => {
            // Physics
            const sway = Math.sin(time * f.swaySpeed + f.swayOffset) * swayAmp * f.wobble;
            const turbulence = Math.sin(time * 1.5 + f.x * 0.01) * 0.2;

            f.y += f.speed;
            f.x += sway + turbulence + wind * windFactor * f.size * 0.15;
            f.rotation += f.rotationSpeed;

            // Draw based on layer
            if (i === 0) drawCrystal(f.x, f.y, f.size, f.opacity, f.rotation);
            else if (i === 1) drawStar(f.x, f.y, f.size, f.opacity, f.rotation);
            else drawDot(f.x, f.y, f.size, f.opacity);

            // Reset when off screen
            if (f.y > canvas.height + f.size * 2) {
                layer[idx] = createFlake(null, i);
                layer[idx].y = -f.size * 2;
            }
            if (f.x > canvas.width + f.size * 2) f.x = -f.size;
            else if (f.x < -f.size * 2) f.x = canvas.width + f.size;
        });
    }

    requestAnimationFrame(animateSnow);
}

// Mouse adds subtle wind influence
document.addEventListener('mousemove', e => {
    targetWind += (e.clientX - canvas.width / 2) / canvas.width * 0.05;
    targetWind = Math.max(-2, Math.min(2, targetWind));
});

window.addEventListener('resize', () => { resizeCanvas(); createSnowLayers(); });
resizeCanvas();
createSnowLayers();
animateSnow();

// ========================================
// AUTOCOMPLETE
// ========================================
const cityInput = document.getElementById('cityInput');
const autocompleteList = document.getElementById('autocompleteList');

cityInput.addEventListener('input', function() {
    const query = this.value.trim();

    if (autocompleteTimeout) clearTimeout(autocompleteTimeout);

    if (query.length < 1) {
        autocompleteList.classList.remove('active');
        return;
    }

    autocompleteTimeout = setTimeout(() => fetchAutocomplete(query), 300);
});

cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        autocompleteList.classList.remove('active');
        searchCity();
    }
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container')) {
        autocompleteList.classList.remove('active');
    }
});

async function fetchAutocomplete(query) {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=${currentLang}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            renderAutocomplete(data.results);
        } else {
            autocompleteList.classList.remove('active');
        }
    } catch (error) {
        autocompleteList.classList.remove('active');
    }
}

function renderAutocomplete(results) {
    autocompleteList.innerHTML = results.map(loc => `
        <div class="autocomplete-item" onclick="selectLocation(${loc.latitude}, ${loc.longitude}, '${loc.name.replace(/'/g, "\\'")}', '${(loc.country || '').replace(/'/g, "\\'")}')">
            <div class="city">${loc.name}</div>
            <div class="country">${[loc.admin1, loc.country].filter(Boolean).join(', ')}</div>
        </div>
    `).join('');
    autocompleteList.classList.add('active');
}

function selectLocation(lat, lon, name, country) {
    currentLocation = {
        name: country ? `${name}, ${country}` : name,
        lat: lat,
        lon: lon
    };
    cityInput.value = name;
    autocompleteList.classList.remove('active');
    fetchForecast(lat, lon);
}

// ========================================
// WEATHER
// ========================================
async function searchCity() {
    const city = cityInput.value.trim();
    if (!city) return;

    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=${currentLang}`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            showError(t('cityNotFound'));
            return;
        }

        const loc = data.results[0];
        currentLocation = {
            name: `${loc.name}, ${loc.country}`,
            lat: loc.latitude,
            lon: loc.longitude
        };

        await fetchForecast(loc.latitude, loc.longitude);
    } catch (error) {
        showError(t('fetchError'));
    }
}

function useMyLocation() {
    if (!navigator.geolocation) {
        showError(t('locationError'));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            currentLocation = {
                name: t('myLocation'),
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            };
            await fetchForecast(pos.coords.latitude, pos.coords.longitude);
        },
        () => showError(t('locationError'))
    );
}

async function fetchForecast(lat, lon) {
    document.getElementById('forecastCard').classList.remove('hidden');
    document.getElementById('alertCard').classList.add('hidden');
    document.getElementById('chartContainer').classList.add('hidden');
    document.getElementById('shareSection').classList.add('hidden');
    document.getElementById('forecastContent').innerHTML = `<div class="loading">${t('loading')}</div>`;

    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=snowfall_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=14`
        );
        if (!response.ok) throw new Error(`Forecast request failed: ${response.status}`);
        const data = await response.json();
        const daily = normalizeDailyData(data.daily);
        if (daily.time.length === 0) throw new Error('Missing daily forecast data');

        currentForecast = daily;
        document.getElementById('locationName').textContent = currentLocation.name;
        document.getElementById('currentLocation').classList.add('active');
        updateLocationMap(lat, lon, currentLocation.name);

        renderForecast(daily);
        renderChart(daily);

        document.getElementById('alertCard').classList.remove('hidden');
        document.getElementById('shareSection').classList.remove('hidden');
        checkAlerts();
    } catch (error) {
        showError(t('fetchError'));
    }
}

function renderForecast(daily) {
    const days = t('days');
    let html = '<div class="forecast-grid">';
    let hasSnow = false;
    const totalDays = Math.min(daily.time.length, 14);

    for (let i = 0; i < totalDays; i++) {
        if (i === 7) {
            html += `<div class="week-divider">${t('week2')}</div>`;
        }

        const date = new Date(daily.time[i]);
        const dayName = i === 0 ? t('today') : i === 1 ? t('tomorrow') : `${days[date.getDay()]} ${date.getDate()}`;
        const snow = daily.snowfall_sum[i] || 0;
        const tempMax = Math.round(daily.temperature_2m_max[i]);
        const tempMin = Math.round(daily.temperature_2m_min[i]);
        const precipProb = daily.precipitation_probability_max[i] || 0;
        const dayConfidence = Math.max(0, 100 - (i * 5));
        const confidence = Math.round((dayConfidence + precipProb) / 2);

        let probClass = confidence >= 75 ? 'high' : confidence >= 50 ? 'medium' : 'low';
        let snowClass = '';
        let icon = '☀️';

        if (snow > 0) {
            hasSnow = true;
            snowClass = snow >= 10 ? 'heavy-snow' : 'snow';
            icon = snow >= 10 ? '❄️❄️' : '❄️';
        } else {
            const code = daily.weathercode[i];
            if (code >= 71 && code <= 77) { icon = '🌨️'; snowClass = 'snow'; hasSnow = true; }
            else if (code >= 61 && code <= 67) icon = '🌧️';
            else if (code >= 51 && code <= 57) icon = '🌦️';
            else if (code >= 1 && code <= 3) icon = '⛅';
        }

        html += `
            <div class="forecast-day ${snowClass}">
                <span class="day-name">${dayName}</span>
                <span class="snow-icon">${icon}</span>
                <span class="snow-amount">
                    ${snow > 0 ? `<span class="snow-value">${snow.toFixed(1)} cm</span>` : `${tempMin}°/${tempMax}°`}
                </span>
                <span class="probability ${probClass}">
                    <div class="probability-bar"><div class="probability-fill" style="width:${confidence}%"></div></div>
                    ${confidence}%
                </span>
            </div>
        `;
    }

    html += '</div>';
    if (!hasSnow) html += `<div class="no-snow">${t('noSnow')}</div>`;
    document.getElementById('forecastContent').innerHTML = html;
}

function renderChart(daily) {
    const days = t('days');
    const labels = [];
    const dailySnow = [];
    const cumulativeSnow = [];
    const confidenceData = [];
    let total = 0;
    const totalDays = Math.min(daily.time.length, 14);

    for (let i = 0; i < totalDays; i++) {
        const date = new Date(daily.time[i]);
        labels.push(i === 0 ? t('today') : `${days[date.getDay()]} ${date.getDate()}`);

        const snow = daily.snowfall_sum[i] || 0;
        const precipProb = daily.precipitation_probability_max[i] || 0;
        const dayConfidence = Math.max(0, 100 - (i * 5));
        const confidence = Math.round((dayConfidence + precipProb) / 2);

        dailySnow.push(snow);
        total += snow;
        cumulativeSnow.push(parseFloat(total.toFixed(1)));
        confidenceData.push(confidence);
    }

    document.getElementById('totalSnow').textContent = `${total.toFixed(1)} cm`;
    document.getElementById('chartContainer').classList.remove('hidden');

    const ctx = document.getElementById('snowChart').getContext('2d');
    if (snowChart) snowChart.destroy();

    snowChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: t('dailySnow'),
                    data: dailySnow,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2,
                    borderRadius: 4,
                    order: 3
                },
                {
                    label: t('cumulative'),
                    data: cumulativeSnow,
                    type: 'line',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    order: 1,
                    yAxisID: 'y'
                },
                {
                    label: t('confidencePercent'),
                    data: confidenceData,
                    type: 'line',
                    borderColor: 'rgba(16, 185, 129, 0.8)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3,
                    pointRadius: 2,
                    order: 2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { size: 10 } }
                },
                y1: {
                    beginAtZero: true,
                    max: 100,
                    position: 'right',
                    grid: { display: false },
                    ticks: { font: { size: 10 }, callback: v => v + '%' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 45 }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, padding: 10, font: { size: 10 } }
                }
            }
        }
    });
}

// ========================================
// SHARE
// ========================================
function getShareText() {
    if (!currentForecast || !currentLocation) return '';

    let total = 0;
    const snowDays = [];
    const days = t('days');
    const totalDays = Math.min(currentForecast.time.length, 14);

    for (let i = 0; i < totalDays; i++) {
        const snow = currentForecast.snowfall_sum[i] || 0;
        total += snow;
        if (snow > 0) {
            const date = new Date(currentForecast.time[i]);
            const dayName = i === 0 ? t('today') : i === 1 ? t('tomorrow') : `${days[date.getDay()]} ${date.getDate()}`;
            const precipProb = currentForecast.precipitation_probability_max[i] || 0;
            const confidence = Math.round((Math.max(0, 100 - (i * 5)) + precipProb) / 2);
            snowDays.push(`${dayName}: ${snow.toFixed(1)}cm (${confidence}%)`);
        }
    }

    let text = `${t('title')} - ${currentLocation.name}\n\n`;
    text += snowDays.length > 0 ? snowDays.join('\n') + '\n\n' : `${t('noSnow')}\n\n`;
    text += `${t('total14days')}: ${total.toFixed(1)} cm`;
    return text;
}

async function nativeShare() {
    const text = getShareText();
    if (navigator.share) {
        try { await navigator.share({ title: t('title'), text }); }
        catch (err) { if (err.name !== 'AbortError') copyToClipboard(); }
    } else copyToClipboard();
}

function copyToClipboard() {
    navigator.clipboard.writeText(getShareText())
        .then(() => showToast(t('copied')))
        .catch(() => showToast(t('copyFailed')));
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========================================
// ALERTS
// ========================================
function toggleAlerts() { checkAlerts(); }

function checkAlerts() {
    const alertToggle = document.getElementById('alertToggle');
    const thresholdInput = document.getElementById('threshold');
    const banner = document.getElementById('alertBanner');
    if (!alertToggle || !thresholdInput || !banner) return;

    const enabled = alertToggle.checked;
    const threshold = parseFloat(thresholdInput.value) || 0;

    if (!enabled || !currentForecast) { banner.classList.remove('active'); return; }

    const alerts = [];
    const days = t('days');
    const totalDays = Math.min(currentForecast.time.length, 14);

    for (let i = 0; i < totalDays; i++) {
        const snow = currentForecast.snowfall_sum[i] || 0;
        if (snow >= threshold) {
            const date = new Date(currentForecast.time[i]);
            const dayName = i === 0 ? t('today') : i === 1 ? t('tomorrow') : `${days[date.getDay()]} ${date.getDate()}`;
            const precipProb = currentForecast.precipitation_probability_max[i] || 0;
            const confidence = Math.round((Math.max(0, 100 - (i * 5)) + precipProb) / 2);
            alerts.push(`${dayName}: ${snow.toFixed(1)} cm (${confidence}%)`);
        }
    }

    if (alerts.length > 0) {
        document.getElementById('alertMessage').innerHTML = alerts.join('<br>');
        banner.classList.add('active');
    } else banner.classList.remove('active');
}

async function sendEmailAlert() {
    const email = document.getElementById('emailAddress').value.trim();
    const status = document.getElementById('emailStatus');

    if (!email) { status.className = 'email-status error'; status.textContent = t('enterEmail'); return; }
    if (!currentForecast) { status.className = 'email-status error'; status.textContent = t('searchFirst'); return; }

    if (EMAIL_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        const mailto = `mailto:${email}?subject=${encodeURIComponent(t('snowAlert'))}&body=${encodeURIComponent(getShareText())}`;
        status.className = 'email-status info';
        status.innerHTML = `<a href="${mailto}">${t('send')}</a>`;
        return;
    }

    status.className = 'email-status info';
    status.textContent = '...';

    try {
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, {
            to_email: email,
            message: getShareText()
        });
        status.className = 'email-status success';
        status.textContent = t('emailSent');
    } catch (e) {
        status.className = 'email-status error';
        status.textContent = t('emailFailed');
    }
}

function showError(msg) {
    document.getElementById('forecastCard').classList.remove('hidden');
    document.getElementById('forecastContent').innerHTML = `<div class="error">${msg}</div>`;
}

// ========================================
// INITIALIZATION
// ========================================
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
