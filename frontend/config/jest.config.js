const path = require("path");

module.exports = {
  collectCoverageFrom: ["**/*.{js,jsx}"],
  moduleFileExtensions: ["js", "jsx"],
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "^_frontend(.*)$": "<rootDir>/frontend/$1",
    "^_assets(.*)$": "<rootDir>/frontend/assets/$1",
    "^_styles(.*)$": "<rootDir>/frontend/styles/$1",
    "^_utils(.*)$": "<rootDir>/frontend/utils/$1",
    "^_api(.*)$": "<rootDir>/frontend/api/$1",
    "^_hooks(.*)$": "<rootDir>/frontend/hooks/$1",
    "^_atoms(.*)$": "<rootDir>/frontend/components/atoms/$1",
    "^_molecules(.*)$": "<rootDir>/frontend/components/molecules/$1",
    "^_organisms(.*)$": "<rootDir>/frontend/components/organisms/$1",
    "^_templates(.*)$": "<rootDir>/frontend/components/templates/$1",
    "^_pages(.*)$": "<rootDir>/frontend/components/pages/$1",
    "^_environment(.*)$": "<rootDir>/frontend/components/environment/$1",
    "^_store(.*)$": "<rootDir>/frontend/store/$1",
    "^_actions(.*)$": "<rootDir>/frontend/store/actions/$1",
    "^_reducers(.*)$": "<rootDir>/frontend/store/reducers/$1",
    "^_thunks(.*)$": "<rootDir>/frontend/store/thunks/$1",
  },
  rootDir: path.join(__dirname, "../.."),
  setupFiles: [
    "<rootDir>/frontend/config/jest.setup.js",
    "<rootDir>/frontend/config/enzyme.setup.js",
  ],
  testEnvironment: "jsdom",
  testMatch: [path.join(__dirname, "../../**/?(*.)+(spec|test).[tj]s?(x)")],
  testURL: "http://localhost",
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
    // eslint-disable-next-line
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/frontend/config/assetsTransformer.js",
  },
};
