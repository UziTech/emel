export default {
	restoreMocks: true,
	clearMocks: true,
	// collectCoverage: true,
	collectCoverageFrom: [
		"src/**/*.js",
		"!**/node_modules/**",
	],
	coverageDirectory: "coverage",
	coverageThreshold: {
		"global": {
			"branches": 100,
			"functions": 100,
			"lines": 100,
			"statements": 100
		}
	},
	testRegex: /\.test\.c?js$/.source,
	testEnvironment: "jsdom",
	transform: {},
};
