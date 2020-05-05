import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as semver from "semver";
import { Octokit } from "@octokit/rest";

/**
 * @returns {string} the Rust target specifier for the current platform.
 */
function getTarget(): string {
  const { arch, platform } = process;
  if (arch == "x64") {
    if (platform == "linux") {
      return "x86_64-unknown-linux-musl";
    } else if (platform == "darwin") {
      return "x86_64-apple-darwin";
    } else if (platform == "win32") {
      return "x86_64-pc-windows-msvc";
    }
  }
  throw new Error(
    `failed to determine current target; arch = ${arch}, platform = ${platform}`
  );
}

/**
 * Represents a tool to install from GitHub.
 */
interface Tool {
  /** The GitHub owner (username or organization). */
  owner: string;
  /** The name of the tool and the GitHub repo name. */
  name: string;
  /** A valid semantic version specifier for the tool. */
  versionSpec?: string;
}

/**
 * Represents a single release for a {@link Tool}.
 */
interface Release {
  /** The exact release tag. */
  version: string;
  /** The asset download URL. */
  downloadUrl: string;
}

/**
 * Fetch the latest matching release for the given tool.
 *
 * @param tool the tool to fetch a release for.
 * @param target the Rust target specifier that should be included in the GitHub
 * release asset.
 *
 * @returns {Promise<Release>} a single GitHub release.
 */
async function getRelease(tool: Tool, target: string): Promise<Release> {
  const { owner, name, versionSpec } = tool;
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  return octokit
    .paginate(
      octokit.repos.listReleases,
      { owner, repo: name },
      (response, done) => {
        const releases = response.data
          .map((rel) => {
            const asset = rel.assets.find((ass) => ass.name.includes(target));
            if (asset) {
              return {
                version: rel.tag_name.replace(/^v/, ""),
                downloadUrl: asset.browser_download_url,
              };
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
    .then((releases) => {
      const release = releases.find((release) => release != null);
      if (release === undefined) {
        throw new Error(
          `no release for ${name} matching version specifier ${versionSpec}`
        );
      }
      return release;
    });
}

/**
 * Checks the tool cache for the tool, and if it is missing fetches it from
 * GitHub releases.
 *
 * @param tool the tool to check or install.
 * @param target the Rust target specifier that should be included in the GitHub
 * release asset.
 *
 * @returns the directory containing the tool binary.
 */
async function checkOrInstallTool(tool: Tool, target: string): Promise<string> {
  const { name, versionSpec } = tool;

  // first check if we have previously donwloaded the tool
  const cache = tc.find(name, versionSpec || "*");
  if (cache) {
    core.info(
      `${name} matching version specifier ${versionSpec} found in cache`
    );
    return cache;
  }

  // find the latest release by querying GitHub API
  const { version, downloadUrl } = await getRelease(tool, target);

  // download, extract, and cache the tool
  core.info(`Download from "${downloadUrl}"`);
  const artifact = await tc.downloadTool(downloadUrl);

  core.info("Extract downloaded archive");
  const dir = `./${name}-${version}`;

  let extractDir;
  if (downloadUrl.endsWith(".zip")) {
    extractDir = await tc.extractZip(artifact, dir);
  } else {
    extractDir = await tc.extractTar(artifact, dir);
  }

  return tc.cacheDir(extractDir, name, version);
}

async function main() {
  try {
    const versionSpec = core.getInput("just-version");
    const target = getTarget();
    const cacheDir = await checkOrInstallTool(
      {
        owner: "casey",
        name: "just",
        versionSpec,
      },
      target
    );
    core.addPath(cacheDir);
  } catch (err) {
    core.setFailed(err.message);
  }
}

main();
