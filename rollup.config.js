import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import pkg from "./package.json";

const extensions = [".ts", ".js"];

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.exports,
      format: "es",
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions,
    }),
    commonjs({
      include: ["node_modules/**"],
    }),
    typescript({
      typescript: require("typescript"),
    }),
    babel({
      babelHelpers: "bundled",
      include: ["src/**/*"],
      exclude: ["node_modules/**"],
      extensions,
    }),
  ],
};
