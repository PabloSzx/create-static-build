const shell = require("shelljs");
const _ = require("lodash");
const path = require("path");

module.exports = class Shell {
  constructor({ context, folder, adjust, name, staticPath, scripts }) {
    this.context = context;
    this.name = name;
    this.adjust = adjust;
    this.staticPath = staticPath;
    this.folder = folder;
    this.scripts = scripts;
  }

  build(
    { resolve, reject },
    name = this.name,
    adjust = this.adjust,
    context = this.context,
    folder = this.folder,
    scripts = this.scripts
  ) {
    if (scripts.build) {
      shell.cd(path.join(context, adjust));
      if (typeof scripts.build === "string") {
        console.log(scripts.build);
        shell.exec(scripts.build, (code, stdout, stderr) => {
          if (code === 0) {
            console.log(`${name} built!`);
            code += this.clearCopy();
            if (code > 0) {
              reject();
            } else {
              resolve();
            }
          } else {
            reject();
          }
        });
      } else {
        console.log(
          `${
            scripts.install ? "yarn --cwd ${folder} --production=false &&" : ""
          } cross-env GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true yarn --cwd ${folder} build`
        );
        shell.exec(
          `${
            scripts.install ? "yarn --cwd ${folder} --production=false &&" : ""
          } cross-env GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true yarn --cwd ${folder} build`,
          (code, stdout, stderr) => {
            if (code === 0) {
              console.log(`${name} built!`);
              code += this.clearCopy();
              if (code > 0) {
                reject();
              } else {
                resolve();
              }
            } else {
              reject();
            }
          }
        );
      }
    }
  }

  clearCopy(
    name = this.name,
    adjust = this.adjust,
    staticPath = this.staticPath,
    folder = this.folder,
    context = this.context,
    scripts = this.scripts
  ) {
    let code = 0;
    if (scripts.copy) {
      if (scripts.remove) {
        console.log(`rm -rf ${path.join(context, adjust, staticPath)}`);
        code += shell.rm("-rf", path.join(context, adjust, staticPath)).code;
      }
      console.log(`mkdir -p ${path.join(context, adjust, staticPath)}`);
      code += shell.mkdir("-p", path.join(context, adjust, staticPath)).code;
      code += shell.cp(
        "-R",
        path.join(context, adjust, folder, "build"),
        path.join(context, adjust, staticPath)
      ).code;
      console.log(
        `${name} build succesfully copied to ${path.join(
          context,
          adjust,
          staticPath
        )}`
      );
    }
    return code;
  }
};
