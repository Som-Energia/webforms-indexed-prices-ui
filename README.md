# Webforms Indexed Prices UI

React integration to display indexed prices in Somenergia's website.

[React Wordpress integration](https://github.com/Som-Energia/react-wordpress/)

## Development

### Setup

It is necesary to have a `.env` file with these variables configured.

```bash
VITE_APP_API_BASE_URL='base url to your api'
VITE_APP_PLAUSIBLE_TRACK_DOMAIN='plausible track domain'
VITE_APP_PLAUSIBLE_APIHOST_URL='plausible api host url'
```

```bash
make ui-deps # to install the project dependencies
make ui-dev  # to start the project in development mode
```

### Tests

```bash
make ui-test # to run the tests
make ui-test-cypress-run # to run the cypress tests
make ui-test-cypress-open # open cypress browser interface
```

### Distribution build

To check a distribution build of the project in your local development environment you can build the project:

```bash
make ui-build # to build the project
```

and run a http local server to serve the project:

```bash
npm install serve
serve -s dist/
```

## Deployment

Use the related script and internal documentation to deploy the project.
