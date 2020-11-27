# `setup-just` action

![build](https://img.shields.io/github/workflow/status/extractions/setup-just/build)

This GitHub Action will install the latest release of the
[just](https://github.com/casey/just) command runner for you.

## Usage

### Inputs

| Name           | Required | Description                             | Type   | Default |
| -------------- | -------- | --------------------------------------- | ------ | ------- |
| `just-version` | no       | A valid NPM-style semver specification. | string | *       |

The semver specification is passed directly to NPM's [semver
package](https://www.npmjs.com/package/semver). This GitHub Action will install
the latest matching release. Examples include

- `just-version: '*'` latest version (default).
- `just-version: '0.8'` equivalent to `>=0.8.0 <0.9.0`.
- `just-version: '0.8.x'` equivalent to `>=0.8.0 <0.9.0`.
- `just-version: '0.8.3'` equivalent to `=0.8.3`.
- `just-version: '^0.8.3'` equivalent to `>=0.8.3 <0.9.0`.

### Basic example

Add the following to your workflow.

```yaml
- uses: extractions/setup-just@v1
  with:
    just-version: 0.8
  env:
    # this is not required but add it if you get any rate limiting issues
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or
   http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.
