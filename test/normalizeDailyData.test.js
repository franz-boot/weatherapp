const { normalizeDailyData } = require('../src/js/forecast-utils.js');

test('normalizeDailyData fills missing arrays and respects time length', ({ assert }) => {
    const daily = {
        time: ['2026-02-15', '2026-02-16'],
        snowfall_sum: [5],
        precipitation_probability_max: [80, 60, 40],
        temperature_2m_max: [1, -2],
        weather_code: [71]
    };

    const normalized = normalizeDailyData(daily);

    assert.strictEqual(normalized.time.length, 2);
    assert.deepStrictEqual(normalized.snowfall_sum, [5, 0], 'snowfall padded with zero');
    assert.deepStrictEqual(normalized.precipitation_probability_max, [80, 60], 'precip trimmed to time length');
    assert.deepStrictEqual(normalized.temperature_2m_max, [1, -2], 'max temps kept');
    assert.deepStrictEqual(normalized.temperature_2m_min, [0, 0], 'missing mins default to 0');
    assert.deepStrictEqual(normalized.weathercode, [71, 0], 'weather_code mapped to weathercode');
});
