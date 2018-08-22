const { getNowInSeconds }= require('./download');

test('Get date in seconds works as expected', () => {
	const dt = new Date(2018, 7, 22);
	const expected = 1534914000;

	expect(getNowInSeconds(dt)).toBe(expected);
});
