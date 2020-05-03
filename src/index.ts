import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as semver from "semver";
import { Octokit } from "@octokit/rest";

function getTarget(): string {
  if (process.arch == "x64") {
    if (process.platform == "linux") {
      return "x86_64-unknown-linux-musl";
    } else if (process.platform == "darwin") {
      return "x86_64-apple-darwin";
    } else if (process.platform == "win32") {
      return "x86_64-pc-windows-msvc";
    }
  }
  throw new Error(
    `failed to determine current target; arch = ${process.arch}, platform = ${process.platform}`
  );
}

class Release {
  version: string;
  downloadUrl: string;

  constructor(version: string, downloadUrl: string) {
    this.version = version;
    this.downloadUrl = downloadUrl;
  }
}

async function getRelease(
  versionSpec: string | null,
  target: string
): Promise<Release | undefined> {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  return octokit
    .paginate(
      octokit.repos.listReleases,
      { owner: "casey", repo: "just" },
      (response, done) => {
        const releases = response.data
          .map((rel) => {
            const asset = rel.assets.find((ass) => ass.name.includes(target));
            if (asset) {
              return new Release(
                rel.tag_name.replace(/^v/, ""),
                asset.browser_download_url
              );
            }
          })
          .filter((rel) =>
            rel && versionSpec
              ? semver.satisfies(rel.version, versionSpec)
              : true
          );
        if (releases && done) {
          done();
        }
        return releases;
      }
    )
    .then((releases) => releases.find(Boolean));
}

async function checkOrInstallTool(
  toolName: string,
  versionSpec: string | null,
  target: string
): Promise<string> {
  // first check if we have previously donwloaded the tool
  const cache = tc.find(toolName, versionSpec || "*");
  if (cache) {
    core.info(
      `${toolName} matching version spec ${versionSpec} found in cache`
    );
    return cache;
  }

  // find the latest release by querying GitHub API
  const release = await getRelease(versionSpec, target);
  if (release === undefined) {
    throw new Error(
      `no release for ${toolName} matching version spec ${versionSpec}`
    );
  }

  // download, extract and cache the tool
  core.info(`Download from "${release.downloadUrl}"`);
  const artifact = await tc.downloadTool(release.downloadUrl);

  core.info("Extract downloaded archive");
  const dir = `./just-${release.version}`;

  let extractDir;
  if (release.downloadUrl.endsWith(".zip")) {
    extractDir = await tc.extractZip(artifact, dir);
  } else {
    extractDir = await tc.extractTar(artifact, dir);
  }

  return tc.cacheDir(extractDir, "just", release.version);
}

async function main() {
  try {
    const version = core.getInput("just-version");
    const target = getTarget();
    const cacheDir = await checkOrInstallTool("just", version, target);
    core.addPath(cacheDir);
  } catch (err) {
    core.setFailed(err.message);
  }
}

main();
