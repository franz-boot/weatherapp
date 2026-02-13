(function (globalScope) {
    function computeConfidence(dayIndex, precipProb = 0) {
        const safeProb = Number.isFinite(precipProb) ? precipProb : 0;
        const dayConfidence = Math.max(0, 100 - (dayIndex * 5));
        return Math.round((dayConfidence + safeProb) / 2);
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

    const api = { normalizeDailyData, computeConfidence };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }

    if (globalScope) {
        globalScope.ForecastUtils = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);
