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
    projectFileContents2.matchAll(re),
    (m) => m[1]
  );
  if (versionMatches.length === 0)
    throw new Error(`Missing "version = "x.y.z" entry in ${projectFilePath}`);
  return versionMatches[0];
}

function getNotebookName(notebookDir) {
    return notebookDir.split("/").pop();
}

function getPackageName(notebookDir) {
  const notebookName = getNotebookName(notebookDir);
  return `${process.env.IMAGE_NAME_BASE}-${notebookName}`;
}

function shouldBuild(notebookDir, { github }) {
    const package = await github.rest.packages.getPackageForAuthenticatedUser({
      package_type: "container",
      package_name: getPackageName(notebookDir),
    });
    console.log(package)
    return true;
}

module.exports = { getNotebookDirs, shouldBuild };