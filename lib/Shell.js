const shell = require("shelljs");
const _ = require("lodash");
const path = require("path");

module.exports = class Shell {
  constructor({ context, folder, adjust, name, staticPath }) {
    this.context = context;
    this.name = name;
    this.adjust = adjust;
    this.staticPath = staticPath;
    this.folder = folder;
  }

  build(name = this.name, adjust = this.adjust, context = this.context) {
    shell.cd(path.join(context, adjust));
    console.log(
      `yarn --cwd ${name} && cross-env GENERATE_SOURCEMAP=false yarn --cwd ${name} build`
    );
    shell.exec(
      `yarn --cwd ${name} && cross-env GENERATE_SOURCEMAP=false yarn --cwd ${name} build`,
      (code, stdout, stderr) => {
        console.log(`${name} built!`);
        this.clearCopy();
      }
    );
  }

  clearCopy(
    name = this.name,
    adjust = this.adjust,
    staticPath = this.staticPath,
    folder = this.folder,
    context = this.context
  ) {
    console.log(`rm -rf ${path.join(context, adjust, staticPath)}`);
    shell.rm("-rf", path.join(context, adjust, staticPath));
    console.log(`mkdir -p ${path.join(context, adjust, staticPath)}`);
    shell.mkdir("-p", path.join(context, adjust, staticPath));
    shell.cp(
      "-R",
      path.join(context, adjust, name, "build"),
      path.join(context, adjust, staticPath)
    );
    console.log(
      `${name} build succesfully copied to ${path.join(
        context,
        adjust,
        staticPath
      )}`
    );
  }
};
