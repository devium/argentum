# Argentum-UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.3.2.

## Development setup

Install Node.js 12+ by following the [official instructions](https://github.com/nodesource/distributions/blob/master/README.md).

Change to the `argentum-ui` directory and install the project packages with `npm install`. Finally, add the local `.bin` directory to your search path: `export PATH="$PATH:$(realpath node_modules/.bin)"`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

When using a dev server, set up the backend and database using Docker. In the project root `docker` folder, execute `docker-compose run --service-ports argentum-api`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build. For AOT compilation, include the --aot option.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
