const { randomScore } = require('./update');

test('Random score should be greater than or equal to 0', () => {
	expect(randomScore()).toBeGreaterThanOrEqual(0);
});

test('Random score should be less than 64', () => {
	expect(randomScore()).toBeLessThan(64);
});
