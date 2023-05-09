import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
	{
		input: "src/emel.js",
		output: {
			name: "emel",
			file: "dist/emel.umd.js",
			format: "umd"
		},
		plugins: [nodeResolve()]
	},
	{
		input: "src/emel.js",
		output: {
			file: "dist/emel.cjs",
			format: "cjs"
		},
		plugins: [nodeResolve()]
	}
];
