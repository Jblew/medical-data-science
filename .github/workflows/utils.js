const fs = require("fs");

function getNotebookDirs() {
  const notebooks_path = "notebooks";
  return fs
    .readdirSync("notebooks")
    .map((name) => `notebooks/${name}`)
    .filter((path) => fs.lstatSync(path).isDirectory());
}

function getVersion(notebookDir) {
  const projectFilePath = `${notebookDir}/Project.toml`;
  if (!fs.existsSync(projectFilePath))
    throw new Error(`File ${projectFilePath} does not exist`);
  const projectFileContents = fs.readFileSync(projectFilePath).toString();
  const re = /^version[^=]*=[^"]*"([^"]+)"[^\n]*$/gim;
  const versionMatches = Array.from(
    projectFileContents.matchAll(re),
    (m) => m[1]
  );
  if (versionMatches.length === 0)
    throw new Error(`Missing "version = "x.y.z" entry in ${projectFilePath}`);
  return versionMatches[0];
}

function getNotebookName(notebookDir) {
  return notebookDir.split("/").pop();
}

function getPackageBaseName(notebookDir, { context }) {
  const notebookName = getNotebookName(notebookDir);
  return `${context.repo.repo}-${notebookName}`.toLowerCase();
}

function getPackageName(notebookDir, { context }) {
  const notebookName = getPackageBaseName(notebookDir, { context });
  return `${context.repo.owner}-${notebookName}`.toLowerCase();
}

async function shouldBuild(notebookDir, { github, context }) {
  const packageName = getPackageBaseName(notebookDir, { context });
  try {
    const version = getVersion(notebookDir);
    const package = await github.rest.packages.getPackageForAuthenticatedUser({
      package_type: "container",
      package_name: packageName,
    });
    console.log(package);
    console.log("Version:", version);
    return false;
  } catch (err) {
    if (err.status === 404) {
      console.log(`Package ${packageName} does not exist. Should be built`);
      return true;
    }
    throw err;
  }
}

async function getNotebookDirsThatShouldBeBuilt({ github, context }) {
  const notebookDirs = getNotebookDirs();
  return await notebookDirs.filter(async (nbDir) => {
    try {
      return await shouldBuild(nbDir, { github, context });
    } catch (err) {
      console.warn(`Warning: Cannot check if ${nbDir} should be built: `, err);
    }
  });
}

module.exports = {
  getNotebookDirs,
  getNotebookDirsThatShouldBeBuilt,
  getPackageName,
  getVersion,
};
