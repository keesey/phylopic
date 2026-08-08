# _PhyloPic_ API Documentation

This project is for documenting the API (Application Programming Interface) for [_PhyloPic_](https://www.phylopic.org). The primary file is [`public/2.0/openapi.yaml`](./public/2.0/openapi.yaml), which is written using the [OpenAPI Specification](https://swagger.io/specification/).

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

### Environment variables

No application code in this project reads an environment variable. The only environment
dependency is the AWS credential used by `yarn deploy`, which runs

```sh
aws s3 sync --acl public-read --delete ./public s3://api-docs.phylopic.org
```

so whatever the AWS CLI resolves from its credential chain is what publishes the documentation.

#### Used by `yarn deploy`

| Variable                                                          | Purpose                                  | How it is read                       |
| ----------------------------------------------------------------- | ---------------------------------------- | ------------------------------------ |
| `AWS_PROFILE`                                                     | Selects a named profile from `~/.aws`    | AWS CLI credential chain, implicitly |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` | Credentials, if not taken from a profile | AWS CLI credential chain, implicitly |
| `AWS_REGION`, `AWS_DEFAULT_REGION`                                | Region, if not set in the profile        | AWS CLI credential chain, implicitly |

None of these need to be set explicitly if `~/.aws/credentials` and `~/.aws/config` are
configured; the CLI reads them only as overrides.

#### Notes

The identity used here needs write access to the `api-docs.phylopic.org` bucket, including
`s3:PutObjectAcl` for `--acl public-read` and `s3:DeleteObject` for `--delete`. It is not one of
the application principals in [`aws/`](../../aws/README.md), because publishing docs is an
operator action rather than something an app does at runtime.

## Authors

- **T. Michael Keesey** - [keesey](https://github.com/keesey)

## License

This project is licensed under the [CC0 License](https://creativecommons.org/share-your-work/public-domain/cc0).
