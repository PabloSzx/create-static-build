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
          console.log(`${name} built!`);
          this.clearCopy();
        });
      } else {
        console.log(
          `yarn --cwd ${folder} && cross-env GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true yarn --cwd ${folder} build`
        );
        shell.exec(
          `yarn --cwd ${folder} && cross-env GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true yarn --cwd ${folder} build`,
          (code, stdout, stderr) => {
            console.log(`${name} built!`);
            this.clearCopy();
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
    if (scripts.remove) {
      console.log(`rm -rf ${path.join(context, adjust, staticPath)}`);
      shell.rm("-rf", path.join(context, adjust, staticPath));
    }
    if (scripts.copy) {
      console.log(`mkdir -p ${path.join(context, adjust, staticPath)}`);
      shell.mkdir("-p", path.join(context, adjust, staticPath));
      shell.cp(
        "-R",
        path.join(context, adjust, folder, "build"),
        path.join(context, adjust, staticPath)
      );
    }
    console.log(
      `${name} build succesfully copied to ${path.join(
        context,
        adjust,
        staticPath
      )}`
    );
  }
};
