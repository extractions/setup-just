import * as core from "@actions/core";
import * as setup from "@extractions/setup-crate";

async function main() {
  try {
    const versionSpec = core.getInput("just-version");
    const tool = await setup.checkOrInstallTool({
      owner: "casey",
      name: "just",
      versionSpec,
    });
    core.addPath(tool.dir);
    core.info(`Successfully setup ${tool.name} v${tool.version}`);
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(err.message);
    }
  }
}

main();
