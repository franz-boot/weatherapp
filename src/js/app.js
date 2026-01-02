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

// ========================================
// SNOW ANIMATION
// ========================================
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
let snowflakes = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createSnowflakes() {
    const count = Math.floor(window.innerWidth / 10);
    snowflakes = [];
    for (let i = 0; i < count; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            wind: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.6 + 0.4
        });
    }
}

function animateSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();
        flake.y += flake.speed;
        flake.x += flake.wind + Math.sin(flake.y * 0.01) * 0.5;
        if (flake.y > canvas.height) { flake.y = -5; flake.x = Math.random() * canvas.width; }
        if (flake.x > canvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = canvas.width;
    });
    requestAnimationFrame(animateSnow);
}

window.addEventListener('resize', () => { resizeCanvas(); createSnowflakes(); });
resizeCanvas();
createSnowflakes();
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
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=snowfall_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=14`
        );
        const data = await response.json();

        currentForecast = data.daily;
        document.getElementById('locationName').textContent = currentLocation.name;
        document.getElementById('currentLocation').classList.add('active');

        renderForecast(data.daily);
        renderChart(data.daily);

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
    const enabled = document.getElementById('alertToggle').checked;
    const threshold = parseFloat(document.getElementById('threshold').value) || 0;
    const banner = document.getElementById('alertBanner');

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
