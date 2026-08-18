import typescript from "rollup-plugin-typescript2"

// Turns imported .css files into JS modules that inject a <style> tag at runtime,
// so consumers don't need CSS loader support to get the bundled grid styles.
const inlineCss = () => ({
  name: "inline-css",
  transform(code, id) {
    if (!id.endsWith(".css")) return null
    return {
      code: `var css = ${JSON.stringify(code)};
if (typeof document !== "undefined" && !document.querySelector('style[data-rsi-styles]')) {
  var style = document.createElement("style");
  style.setAttribute("data-rsi-styles", "");
  style.textContent = css;
  document.head.appendChild(style);
}
export default css;`,
      map: { mappings: "" },
    }
  },
})

export default {
  input: `src/index.ts`,
  preserveModules: true,
  output: [
    {
      format: "commonjs",
      dir: "./dist-commonjs",
    },
    {
      format: "esm",
      dir: "./dist",
    },
  ],
  external: [],
  plugins: [
    inlineCss(),
    typescript({
      useTsconfigDeclarationDir: true,
      typescript: require("ttypescript"),
      tsconfigDefaults: {
        exclude: ["**/*.test.ts", "**/*.test.tsx", "**/tests", "**/stories", "./dist", "./dist-commonjs"],
        compilerOptions: {
          declarationDir: "./types",
          declaration: true,
          plugins: [{ transform: "typescript-transform-paths", afterDeclarations: true }],
        },
      },
    }),
  ],
}
