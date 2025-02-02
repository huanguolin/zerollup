module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "^@zerollup\/(.*?)$": "<rootDir>/packages/$1/src"
  },
  rootDir: __dirname,
  testMatch: [
    "<rootDir>/packages/*/__tests__/**/*spec.@(js|ts)?(x)",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    'ts-jest': {
      'tsConfig': 'tsconfig.jest.json'
    }
  },
  testURL: "http://localhost",
};
