# retail-suave

Demo retail application using Angular (1.6) and Express.

## Getting Started

1. Clone the Git repo.

2. Go to retail-suave directory and run ```$ npm install``` from the command line.

3. Go to client directory```$ cd client```

4. Run ```$ bower install```.

4. To start app run ```$ npm start```. Which sill start a server for the UI on port 3001 and a server for the API on port 8080.

## Other Commands

* To bundle for dist ```$ npm run gulp:build```. This will bundle files and put them in client/dist/v1 (version number is controlled in the package.json file)

* To start client only ```$ npm run serve:dev```. This will run a Gulp taks to re-build the index file and compile sass files

* To start api only ```$ npm run serve:api```

* To re-build the src/index.html file ```$ npm run gulp:index```

* To re-compile the sass files ```$ npm run gulp:sass```

## Tests

* To run all tests (api,ui,app and e2e) ```$ npm test```

* To view coverage for application unit tests ```$ npm run test:coverage```. This will start a server on port 8081 and open a browser to the report.

* To run API test ```$ npm test:api```

* To run UI test ```$ npm test:ui```

* To run application unit tests ```$ npm test:app```

* To run e2e tests ```$ npm test:e2e```

* To update the Selenium webdriver ```$ npm test:update-webdriver```

* To start the Selenium webdriver ```$ npm test:start-webdriver``` (this needs to be done before the e2e tests will run)
