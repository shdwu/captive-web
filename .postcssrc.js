// https://github.com/michael-ciniawsky/postcss-load-config
const path = require("path")

module.exports = {
  "plugins": {
    "precss": {},
    "postcss-import": {},
    "postcss-url": {},
    "postcss-assets": {
      loadPaths: [path.resolve(__dirname, "./src/assets/")],
      relative: true,
      baseUrl: "static/img"
    },
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}
  }
}
