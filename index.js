const HashFolder = require("./lib/HashFolder");
const Checksum = require("./lib/Checksum");

module.exports = class createStaticBuild {
  constructor({ context, folder, name } = {}) {
    this.context = context;
    this.folder = folder;
    this.name = name;

    this.hashFolder = new HashFolder({ context, folder, name });
    this.checksum = new Checksum({ context, folder, name });

    this.check();
  }

  async check() {
    try {
      const hash = await this.hashFolder.getHashFolder();
      await this.checksum.ready();
      this.checksum.checkHashFolder(hash);
    } catch (err) {
      console.error(err);
    }
  }
};
