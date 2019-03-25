const HashFolder = require("./lib/HashFolder");
const Checksum = require("./lib/Checksum");
const Shell = require("./lib/Shell");
module.exports = class createStaticBuild {
  constructor(
    {
      context,
      folder,
      name,
      adjust,
      staticPath,
      checksumFolder,
      onStart = true,
      scripts = {
        build: true,
        remove: true,
        copy: true,
      },
      hashFolder,
      shellFolder,
      silent = false,
      force = false,
    } = {}
  ) {
    this.context = context;
    this.folder = folder;
    this.name = name;
    this.adjust = adjust;
    this.staticPath = staticPath;
    this.checksumFolder = checksumFolder;
    this.silent = silent;
    this.force = force;

    this.hashFolder = new HashFolder({
      context,
      folder: hashFolder || folder,
      name,
      adjust,
    });
    this.checksum = new Checksum({
      context,
      folder,
      name,
      adjust,
      checksumFolder,
    });
    this.shell = new Shell({
      context,
      adjust,
      name,
      staticPath,
      folder: shellFolder || folder,
      scripts,
    });

    if (onStart) this.check();
  }

  async check(name = this.name) {
    try {
      const hash = await this.hashFolder.getHashFolder();
      let resolve;
      let reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      await this.checksum.ready();
      const build = await this.checksum.checkHashFolder({ promise }, hash);
      if (this.force || build) {
        console.log(`${name} building...`);
        this.shell.build({ resolve, reject });
      } else {
        if (!this.silent) console.log(`No changes detected in ${name}`);
      }
    } catch (err) {
      if (err) console.error(err);
    }
  }
};
