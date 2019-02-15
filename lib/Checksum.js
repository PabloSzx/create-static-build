const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const mkdirp = require("mkdirp");

module.exports = class Checksum {
  constructor({ context, folder, name = "default" }) {
    this.context = context;
    this.folder = folder;
    this.name = name;
  }

  async ready(name = this.name) {
    return new Promise((resolve, reject) => {
      mkdirp(path.join(__dirname, "../data"), err => {
        fs.writeFile(
          path.join(__dirname, "../data/checksum.json"),
          JSON.stringify({}),
          { flag: "wx" },
          err => {
            try {
              this.read();
              if (!_.has(this.checksum, name)) {
                this.checksum[name] = {
                  checksum: "",
                  modified: false,
                };
                this.save();
              }
              resolve(true);
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    });
  }

  checkHashFolder(hash, name = this.name) {
    if (this.checksum[name].checksum !== hash) {
      this.checksum[name].checksum = hash;
      this.checksum[name].modified = true;
      console.log("shellbuild shellcopy");
      //shell build
    } else {
      this.checksum[name].modified = false;
    }

    this.save();
  }

  read() {
    this.checksum = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/checksum.json")).toString()
    );
  }

  save(checksum = this.checksum, name = this.name) {
    fs.writeFile(
      path.join(__dirname, "../data/checksum.json"),
      JSON.stringify(checksum),
      "utf8",
      err => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Checksum ${name} saved`);
        }
      }
    );
  }
};
