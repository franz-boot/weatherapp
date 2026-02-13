const assert = require('assert');

const tests = [];
function test(name, fn) {
    tests.push({ name, fn });
}

global.test = test;
global.assert = assert;

require('./normalizeDailyData.test');
require('./computeConfidence.test');

(async () => {
    let failed = 0;
    for (const t of tests) {
        try {
            await t.fn({ assert });
            console.log(`✓ ${t.name}`);
        } catch (err) {
            failed += 1;
            console.error(`✗ ${t.name}`);
            console.error(err.stack || err);
        }
    }
    process.exit(failed === 0 ? 0 : 1);
})();
