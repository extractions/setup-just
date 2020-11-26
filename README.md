# `setup-just` action

![build](https://img.shields.io/github/workflow/status/extractions/setup-just/build)

This GitHub Action will install the latest release of the
[just](https://github.com/casey/just) command runner for you.

## Usage

### Inputs

| Name           | Required | Description                                              | Type   | Default |
| -------------- | -------- | -------------------------------------------------------- | ------ | ------- |
| `just-version` | no       | A valid semver specification for the version to install. | string | *       |


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
