const HashFolder = require("./lib/HashFolder");
const Checksum = require("./lib/Checksum");
const Shell = require("./lib/Shell");
module.exports = class createStaticBuild {
  constructor(
    { context, folder, name, adjust, staticPath, onStart = true } = {}
  ) {
    this.context = context;
    this.folder = folder;
    this.name = name;
    this.adjust = adjust;

    this.hashFolder = new HashFolder({ context, folder, name });
    this.checksum = new Checksum({ context, folder, name });
    this.shell = new Shell({ context, adjust, name, staticPath, folder });

    if (onStart) this.check();
  }

  async check(name = this.name) {
    try {
      const hash = await this.hashFolder.getHashFolder();
      await this.checksum.ready();
      const build = await this.checksum.checkHashFolder(hash);
      if (build) {
        console.log(`${name} building...`);
        this.shell.build();
      } else {
        console.log(`No changes detected in ${name}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
};
