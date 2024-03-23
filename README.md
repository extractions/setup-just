# 🤖 `setup-just` action

[![Build Status](https://img.shields.io/github/actions/workflow/status/extractions/setup-just/build.yaml?branch=trunk)](https://github.com/extractions/setup-just/actions/workflows/build.yaml)

This GitHub Action will install a release of the
[just](https://github.com/casey/just) command runner for you.

## Usage

### Examples

In most cases all you will need is the following in your workflow.

```yaml
- uses: extractions/setup-just@v2
```

If you want a specific version of `just` you can specify this by passing the
`just-version` input.

```yaml
- uses: extractions/setup-just@v2
  with:
    just-version: '1.4.0'
```

To avoid rate-limiting, the default Github token available to all actions, is
automatically used to authenticate calls to Github. To override it, set the
environment variable `GITHUB_TOKEN` or pass the input `github-token`.

```yaml
- uses: extractions/setup-just@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

or

```yaml
- uses: extractions/setup-just@v2
  with:
    github-token: ${{ secrets.MY_GITHUB_TOKEN }}
```

### Inputs

| Name           | Required | Description                                  | Type   | Default               |
| -------------- | -------- | -------------------------------------------- | ------ | --------------------- |
| `just-version` | no       | A valid NPM-style semver specification.      | string | *                     |
| `github-token` | no       | A Github token to authenticate API requests. | string | `${{ github.token }}` |

The semver specification is passed directly to NPM's [semver
package](https://www.npmjs.com/package/semver). This GitHub Action will install
the latest matching release. Examples include

- `just-version: '*'` latest version (default).
- `just-version: '0.10'` equivalent to `>=0.10.0 <0.11.0`.
- `just-version: '0.10.x'` equivalent to `>=0.10.0 <0.11.0`.
- `just-version: '0.10.0'` equivalent to `=0.10.0`.
- `just-version: '^0.10.0'` equivalent to `>=0.10.0 <0.11.0`.

## Development

Most of the installation logic is done in a shared library located at
[@extractions/setup-crate](https://github.com/extractions/setup-crate).

The following commands are useful for development.

- `npm i`

  Install all dependencies.

- `npm run fmt`

  Format the source code.

- `npm run lint`

  Run all lints.

- `npm run run`

  Test the action by running it.

- `npm run build`

  Build the action and update `dist/`.

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or
   http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.
