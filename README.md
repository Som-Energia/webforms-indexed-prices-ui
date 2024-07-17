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

### Deployment

If you are Som Energia staff you can clone
`deployment-configurations` repository side by side,
so that the links `scripts/deploy-*.conf` are not broken,
and then:

```bash
make deploy-prod     # To deploy in production
make deploy-testing  # To deploy in testing
```

If you are not SomEnergia staff you can create a deployment configuration
```bash
cat scripts/deploy-myserver.conf <<EOF
DEPLOYMENT_BUILD=whatever  # will use .env.whatever as configuration
DEPLOYMENT_HOST=myserver.com # ssh server
DEPLOYMENT_PORT=22 # ssh port
DEPLOYMENT_USER=myuser # ssh user
DEPLOYMENT_PATH=/my/installation/path
DEPLOYMENT_URL=https://myserver.com/path/to/the/page
EOF

scripts/deploy.sh myserver
```

