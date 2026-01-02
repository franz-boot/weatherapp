# Snow Forecast App / Aplikace pro předpověď sněhu

Moderní webová aplikace pro sledování 14denní předpovědi sněžení s upozorněními a vizualizacemi.

## ✨ Funkce

- 📍 **Vyhledávání míst** - Inteligentní autocomplete pro vyhledávání měst po celém světě
- 🌍 **Geolokace** - Automatická detekce aktuální polohy
- ❄️ **14denní předpověď** - Podrobná předpověď sněžení na dva týdny dopředu
- 📊 **Vizualizace dat** - Interaktivní grafy denního a kumulativního sněžení
- 🔔 **Upozornění** - Nastavitelné prahy pro upozornění na sněžení
- 📧 **E-mailové notifikace** - Zasílání upozornění na e-mail (vyžaduje konfiguraci)
- 🌐 **Vícejazyčnost** - Podpora češtiny a němčiny
- 📱 **Responzivní design** - Optimalizováno pro desktop, tablet i mobil
- 🎨 **Animace** - Atraktivní zimní pozadí s padajícím sněhem

## 🚀 Rychlý start

### Lokální spuštění

1. Naklonujte repozitář:
```bash
git clone <repository-url>
cd weatherapp
```

2. Otevřete `index.html` v prohlížeči:
```bash
# Na macOS
open index.html

# Na Linux
xdg-open index.html

# Nebo jednoduše dvojklikem na soubor
```

### S lokálním serverem

Pro vývoj doporučujeme použít lokální HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node.js (s npx)
npx http-server

# PHP
php -S localhost:8000
```

Pak otevřete `http://localhost:8000` v prohlížeči.

## 📁 Struktura projektu

```
weatherapp/
├── index.html              # Hlavní HTML soubor
├── src/
│   ├── css/
│   │   └── style.css      # Všechny styly aplikace
│   └── js/
│       └── app.js         # Hlavní aplikační logika
├── README.md              # Dokumentace (tento soubor)
└── .gitignore            # Git ignore soubor
```

## 🔧 Konfigurace

### E-mailové notifikace (EmailJS)

Pro aktivaci e-mailových upozornění:

1. Zaregistrujte se na [EmailJS](https://www.emailjs.com/)
2. Vytvořte e-mailový servis a šablonu
3. Upravte konfiguraci v `src/js/app.js`:

```javascript
const EMAIL_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',     // Váš Public Key z EmailJS
    serviceId: 'YOUR_SERVICE_ID',     // ID vašeho service
    templateId: 'YOUR_TEMPLATE_ID'    // ID vaší šablony
};
```

Pokud konfiguraci nezměníte, aplikace použije fallback na `mailto:` odkazy.

## 🌐 API a externí služby

Aplikace používá následující veřejná API:

- **Open-Meteo Weather API** - Pro data o počasí a sněžení
  - URL: `https://api.open-meteo.com/v1/forecast`
  - Dokumentace: https://open-meteo.com/

- **Open-Meteo Geocoding API** - Pro vyhledávání měst
  - URL: `https://geocoding-api.open-meteo.com/v1/search`
  - Dokumentace: https://open-meteo.com/en/docs/geocoding-api

- **Chart.js** - Pro vizualizaci dat (CDN)
- **EmailJS** - Pro e-mailové notifikace (volitelné)
- **Google Fonts** - Pro font Inter

## 🎨 Technologie

- **HTML5** - Sémantická struktura
- **CSS3** - Moderní styly s glassmorphism efekty
- **Vanilla JavaScript** - Bez závislostí na frameworku
- **Chart.js** - Grafická vizualizace
- **Canvas API** - Animace padajícího sněhu

## 📱 Responzivní breakpointy

- **Mobile**: < 768px
- **Tablet**: 768px - 1199px
- **Desktop**: ≥ 1200px

## 🌍 Jazykové verze

Aplikace podporuje:
- 🇨🇿 Čeština (výchozí)
- 🇩🇪 Němčina

Přepínání jazyka pomocí tlačítek v pravém horním rohu.

## 🛠️ Vývoj

### Přidání nového jazyka

1. V souboru `src/js/app.js` rozšiřte objekt `translations`:

```javascript
const translations = {
    cs: { /* ... */ },
    de: { /* ... */ },
    en: {  // Nový jazyk
        title: 'Snow Forecast',
        // ... další překlady
    }
};
```

2. Přidejte tlačítko pro přepínání jazyka v `index.html`:

```html
<button class="lang-btn" onclick="setLanguage('en')">EN</button>
```

### Úprava stylů

Všechny styly jsou v `src/css/style.css`. Hlavní sekce:
- Reset a base styly
- Zimní pozadí a hory
- Language switcher
- Dashboard layout (grid)
- Karty a komponenty
- Responzivní media queries

### Úprava aplikační logiky

Hlavní funkce v `src/js/app.js`:
- `setLanguage(lang)` - Přepínání jazyka
- `searchCity()` - Vyhledávání města
- `useMyLocation()` - Použití geolokace
- `fetchForecast(lat, lon)` - Načtení předpovědi
- `renderForecast(daily)` - Vykreslení předpovědi
- `renderChart(daily)` - Vykreslení grafu
- `checkAlerts()` - Kontrola a zobrazení upozornění

## 🐛 Ladění

### Běžné problémy

**Předpověď se nenačítá:**
- Zkontrolujte připojení k internetu
- Otevřete Developer Console (F12) a zkontrolujte chyby
- Ověřte, že API Open-Meteo je dostupné

**Geolokace nefunguje:**
- Uživatel musí povolit přístup k poloze v prohlížeči
- HTTPS je vyžadováno pro geolokaci (nebo localhost)

**Grafy se nezobrazují:**
- Zkontrolujte, že Chart.js CDN je dostupné
- Ověřte konzoli prohlížeče pro JavaScript chyby

### Debug režim

Pro debugging můžete přidat do konzole:

```javascript
// Zobrazit aktuální předpověď
console.log(currentForecast);

// Zobrazit aktuální polohu
console.log(currentLocation);
```

## 📄 Licence

Tento projekt je open source a volně k použití.

## 🤝 Přispívání

Příspěvky jsou vítány! Pro větší změny prosím nejprve otevřete issue a diskutujte, co byste chtěli změnit.

## 📞 Podpora

Pro hlášení chyb nebo dotazy použijte GitHub Issues.

## 🔮 Plánované funkce

- [ ] Offline podpora (Service Worker)
- [ ] PWA podpora (Progressive Web App)
- [ ] Ukládání oblíbených míst (Local Storage)
- [ ] Push notifikace
- [ ] Témata (světlé/tmavé)
- [ ] Export dat do CSV/PDF
- [ ] Historická data sněžení
- [ ] Srovnání více lokalit
- [ ] Integrace s dalšími weather API

---

**Vytvořeno s ❄️ pro milovníky zimních sportů a sněhu**
