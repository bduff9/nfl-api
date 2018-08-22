const { getNowInSeconds }= require('./download');

test('Get date in seconds works as expected', () => {
	const dt = new Date(2018, 7, 22);
	const expected = Math.floor(dt.getTime() / 1000);

	expect(getNowInSeconds(dt)).toBe(expected);
});
