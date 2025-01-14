# Easy Dynamics OSCAL Viewer

The OSCAL Viewer sample application is a React-based UI used for browsing OSCAL data. It is provided both as an
example of using OSCAL React components and as a tool to view the complex OSCAL data concepts in an easily
comprehensive format.

An open sandbox environment of the project can be viewed at
[https://oscal-viewer.msd.easydynamics.com/catalog](https://oscal-viewer.msd.easydynamics.com/catalog).

## Features

In this initial iteration, the project renders basic elements of OSCAL catalogs, profiles, component
definitions, and system security plans.

The NIST 800-53 (rev 5) catalog is loaded by default in the catalog viewer:

![OSCSAL Catalog Viewer Screenshot](docs/resources/catalog-viewer-screenshot.png)

The NIST 800-53 (rev 4) profile is loaded by default in the profile viewer:

![OSCSAL Profile Viewer Screenshot](docs/resources/profile-viewer-screenshot.png)

An Easy Dynamics component definition is loaded by default in the component viewer:

![OSCSAL Component Viewer Screenshot](docs/resources/component-viewer-screenshot.png)

The ssp-example from the OSCAL Github repo is loaded by default in the SSP viewer:

![OSCSAL SSP Viewer Screenshot](docs/resources/ssp-viewer-screenshot.png)

## Running

When in `example/`, the following commands can be issued (NOTE: Library dependencies must be installed first):

```text
npm install
npm start
```

## Testing

Within the `example/src` directory, the following commands are used to run application tests and linter checks,
respectively:

```text
npm run test
npm run lint
```

For details on quickly building the project and running it in the root project directory see "Development" and
"OSCAL Viewer → Running" in the [OSCAL React Library README.md](../README.md).
