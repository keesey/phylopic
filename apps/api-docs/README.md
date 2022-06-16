# _PhyloPic_ API Documentation

This project is for documenting the API (Application Programming Interface) for [_PhyloPic_](https://beta/phylopic.org). The primary file is [`public/2.0/openapi.yaml`](./public/2.0/openapi.yaml), which is written using the [OpenAPI Specification](https://swagger.io/specification/).

## View online

The documentation is hosted online here: [http://api-docs.phylopic.org](http://api-docs.phylopic.org)

## Getting started

See instructions in the [_PhyloPic_ project `README`](../../README.md) for setting up the monorepo project.

## Testing

To test that `public/2.0/openapi.yaml` is valid, run:

```sh
yarn test
```

## Deploying

To deploy to `api-docs.phylopic.org`, you will need to install [AWS Command Line Interface](https://aws.amazon.com/cli/) and set it up with proper credentials.

```sh
yarn deploy
```

## Authors

-   **T. Michael Keesey** - [keesey](https://github.com/keesey)

## License

This project is licensed under the [CC0 License](https://creativecommons.org/share-your-work/public-domain/cc0).
