// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-coverage'),
      require('karma-remap-coverage'),
      require('karma-mocha-reporter'),
      require('karma-sourcemap-loader')
    ],
    client: {
      jasmine: {
        random: false
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {

      dir: './coverage',
      reporters: [
        {
          type: 'in-memory'
        }
      ]
    },

    remapCoverageReporter: {
      'text-summary': null,
      json: './coverage/coverage.json',
      html: './coverage'
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['mocha', 'coverage', 'remap-coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    captureTimeout: 210000,
    browserDisconnectTolerance: 3,
    browserDisconnectTimeout: 210000,
    browserNoActivityTimeout: 210000,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--disable-translate',
          '--disable-web-security',
          '--disable-extensions',
          '--disable-dev-shm-usage',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--no-sandbox',
          '--remote-debugging-port=9222',
          '--js-flags="--max_old_space_size=4096"'
        ]
      }
    },
    singleRun: false
  });
};