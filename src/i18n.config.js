/**
 * Config file for multi languages support, using i18n
 */
const i18n = require("i18n");

i18n.configure({
  locales: ["en_US", "pt_BR"],
  defaultLocale: "en_US",
  directory: __dirname + "/locales",
  objectNotation: true,
  api: {
    __: "translate",
    __n: "translateN"
  }
});

module.exports = i18n;
