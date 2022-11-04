import { defineConfig } from 'cypress'
import getCompareSnapshotsPlugin from 'cypress-image-diff-js/dist/plugin';

export default defineConfig({
  fixturesFolder: 'cypress/fixtures',
  viewportWidth: 390,
  viewportHeight: 844,
  execTimeout: 20000,
	defaultCommandTimeout: 20000,
	requestTimeout: 20000,
  retries: 1,
  screenshotOnRunFailure: false,
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    },
    baseUrl: 'http://54.39.177.218:8080/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    env: {
      isMobile: false
    }
  },
})
