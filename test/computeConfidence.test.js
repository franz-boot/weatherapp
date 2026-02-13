const { computeConfidence } = require('../src/js/forecast-utils.js');

test('computeConfidence blends horizon decay with precipitation probability', ({ assert }) => {
    assert.strictEqual(computeConfidence(0, 80), 90, 'today keeps high confidence');
    assert.strictEqual(computeConfidence(10, 60), 55, 'farther days decay');
});

test('computeConfidence tolerates missing precipitation values', ({ assert }) => {
    assert.strictEqual(computeConfidence(2), 45, 'defaults precip to 0');
    assert.strictEqual(computeConfidence(3, NaN), 43, 'ignores NaN precip');
});
