# 🤖 `setup-just` action

![build](https://img.shields.io/github/workflow/status/extractions/setup-just/build)

This GitHub Action will install a release of the
[just](https://github.com/casey/just) command runner for you.

## Usage

### Examples

In most cases all you will need is the following in your workflow.

```yaml
- uses: extractions/setup-just@v1
```

If you want a specific version of `just` you can specify this by passing the
`just-version` input.

```yaml
- uses: extractions/setup-just@v1
  with:
    just-version: 0.9
```

In rare circumstances you might get rate limiting errors, this is because this
workflow has to make requests to GitHub API in order to list available releases.
If this happens you can set the `GITHUB_TOKEN` environment variable.

```yaml
- uses: extractions/setup-just@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

| Name           | Required | Description                             | Type   | Default |
| -------------- | -------- | --------------------------------------- | ------ | ------- |
| `just-version` | no       | A valid NPM-style semver specification. | string | *       |

The semver specification is passed directly to NPM's [semver
package](https://www.npmjs.com/package/semver). This GitHub Action will install
the latest matching release. Examples include

- `just-version: '*'` latest version (default).
- `just-version: '0.9'` equivalent to `>=0.9.0 <0.10.0`.
- `just-version: '0.9.x'` equivalent to `>=0.9.0 <0.10.0`.
- `just-version: '0.9.0'` equivalent to `=0.9.0`.
- `just-version: '^0.9.0'` equivalent to `>=0.9.0 <0.10.0`.

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or
   http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.
