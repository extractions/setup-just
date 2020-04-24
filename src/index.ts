import * as core from '@actions/core';

async function main() {
  try {
    const version: string | null = core.getInput('version') || null;
    // TODO
    core.info(`[setup-just] installed just v${version}`);
  } catch (err) {
    core.setFailed(err.message);
  }
}

main();
