# PhyloPic API Documentation

This project is for documenting the planned Application Programming Interface for the next version of [*PhyloPic*](http://phylopic.org). The primary file is [`openapi.yaml`](https://github.com/keesey/phylopic-api-docs/blob/master/openapi.yaml), which is written using the [OpenAPI Specification](https://swagger.io/specification/).

## View online

An HTML version of the documentation is currently being hosted [here](http://www.phylopic.org.s3-website-us-west-2.amazonaws.com/api/docs/2.0/).

## Getting started

### Prerequisites

To do development work, you will likely require [yarn](https://yarnpkg.com/). Installation instructions are [here](https://yarnpkg.com/docs/install).

### Installing dependencies

Once yarn is installed, go to the project folder and run:

```sh
yarn
```

## Running the tests

To test that `openapi.yaml` is valid, run:

```sh
yarn test
```

## Generating documentation

To generate documentation as an HTML web page, run:

```sh
yarn build
```

This will create files in `dist/api/docs/2.0/`. To view the document, simply open `index.html` from that folder in a web browser.

## Authors

* **T. Michael Keesey** - [keesey](https://github.com/keesey)

## License

This project is licensed under the [CC0 License](https://creativecommons.org/share-your-work/public-domain/cc0).
