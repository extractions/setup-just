# 🤖 `setup-just` action

[![Build Status](https://github.com/extractions/setup-just/actions/workflows/build.yaml/badge.svg)](https://github.com/extractions/setup-just/actions/workflows/build.yaml)

This GitHub Action will install a release of the
[just](https://github.com/casey/just) command runner for you.

## Usage

### Examples

In most cases all you will need is the following in your workflow.

```yaml
- uses: extractions/setup-just@v4
```

If you want a specific version of `just` you can specify this by passing the
`just-version` input.

```yaml
- uses: extractions/setup-just@v4
  with:
    just-version: '1.46.0'
```

Alternatively you can keep the version in a file and point the action at it with
the `just-version-file` input. Both a `.tool-versions` file (the `just` entry is
read) and a plain version file like `.just-version` are supported.

```yaml
- uses: extractions/setup-just@v4
  with:
    just-version-file: '.tool-versions'
```

To avoid rate-limiting, the default Github token (available to all actions) is
automatically used to authenticate calls to Github. To override it, pass the
input `github-token`.

```yaml
- uses: extractions/setup-just@v4
  with:
    github-token: ${{ secrets.MY_GITHUB_TOKEN }}
```

### Inputs

| Name                | Required | Description                                                   | Type   | Default               |
| ------------------- | -------- | ------------------------------------------------------------- | ------ | --------------------- |
| `just-version`      | no       | A valid NPM-style semver specification.                      | string | *                     |
| `just-version-file` | no       | Path to a file (`.tool-versions` or plain) holding the version. | string | -                     |
| `github-token`      | no       | A Github token to authenticate API requests.                 | string | `${{ github.token }}` |

If both `just-version` and `just-version-file` are set, `just-version` takes
precedence and the file is ignored.

The semver specification is passed directly to NPM's [semver
package](https://www.npmjs.com/package/semver). This GitHub Action will install
the latest matching release. Examples include

- `just-version: '*'` latest version (default).
- `just-version: '1'` equivalent to `>=1.0.0 <2.0.0`.
- `just-version: '1.2'` equivalent to `>=1.2.0 <2.0.0`.
- `just-version: '1.2.3'` equivalent to `=1.2.3`.
- `just-version: '^1.2.3'` equivalent to `>=1.2.3 <2.0.0`.

## Development

This action is a composite action and the installation logic is done in a shared
library located at
[@extractions/setup-crate](https://github.com/extractions/setup-crate).

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or
   http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.
